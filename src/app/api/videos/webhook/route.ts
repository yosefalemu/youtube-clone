import db from "@/db";
import { videos } from "@/db/schema/videos";
import { mux } from "@/lib/mux";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";

const SINGING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebHookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  if (!SINGING_SECRET) {
    throw new Error("No secret found");
  }
  const headerPayload = await headers();
  const muxSignature = headerPayload.get("mux-signature");
  if (!muxSignature) {
    throw new Response("No signature found", { status: 401 });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    { "mux-signature": muxSignature },
    SINGING_SECRET
  );
  switch (payload.type as WebHookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }
      // console.log({ "DATA WHILE VIDEO CREATED": data });
      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;
      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }
      if (!playbackId) {
        return new Response("No playback id found", { status: 400 });
      }
      const temp_thumbnail_url = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const temp_preview_url = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;
      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([temp_thumbnail_url, temp_preview_url]);
      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        return new Response("Error uploading files", { status: 500 });
      }
      const { key: thumbnail_key, ufsUrl: thumbnail_url } =
        uploadedThumbnail.data;
      const { key: preview_key, ufsUrl: preview_url } = uploadedPreview.data;
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl: thumbnail_url,
          previewUrl: preview_url,
          thumbnailKey: thumbnail_key,
          previewKey: preview_key,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
    }
    case "video.asset.errored": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }
      // console.log({ "DATA WHILE DELETE VIDEO": data });
      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.track.ready": {
      // I add assei_id since they left it out
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;
      if (!assetId) {
        return new Response("No asset id found", { status: 400 });
      }
      console.log("DATA WHILE FETCHING TRACK READY", data);
      await db
        .update(videos)
        .set({ muxTrackId: trackId, muxTrackStatus: status })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }
  return new Response("Mux webhook recieved", { status: 200 });
};
