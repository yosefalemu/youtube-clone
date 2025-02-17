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
    return new Error("No secret found");
  }

  const signature = request.headers.get("mux-signature");
  if (!signature) {
    return new Response("No signature found", { status: 401 });
  }
  let payload;
  try {
    const textBody = await request.text();
    if (!textBody) {
      return new Response("Empty body", { status: 400 });
    }
    payload = JSON.parse(textBody);
  } catch (error) {
    console.log({ error });
    return new Response("Invalid json body", { status: 400 });
  }
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    { "mux-signature": signature },
    SINGING_SECRET
  );
  switch (payload.type as WebHookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload id found", { status: 400 });
      }
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

      // Check if this video has already been processed
      const existingVideo = await db
        .select({ muxPlaybackId: videos.muxPlaybackId })
        .from(videos)
        .where(eq(videos.muxUploadId, data.upload_id));

      if (existingVideo.length > 0 && existingVideo[0].muxPlaybackId) {
        return new Response("Duplicate event ignored", { status: 200 });
      }

      // Generate preview and thumbnail URLs
      const temp_thumbnail_url = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const temp_preview_url = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      // Upload images only once
      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([temp_thumbnail_url, temp_preview_url]);

      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        return new Response("Error uploading files", { status: 500 });
      }

      const { key: thumbnail_key, url: thumbnail_url } = uploadedThumbnail.data;
      const { key: preview_key, url: preview_url } = uploadedPreview.data;

      // Update the database
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

      break;
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
      const utapi = new UTApi();
      const [existingVideo] = await db
        .select({ thumbnailKey: videos.thumbnailKey })
        .from(videos)
        .where(eq(videos.muxUploadId, data.upload_id));
      if (!existingVideo.thumbnailKey) {
        return new Response("No thumbnail key found", { status: 400 });
      }
      await utapi.deleteFiles(existingVideo.thumbnailKey);
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
      await db
        .update(videos)
        .set({ muxTrackId: trackId, muxTrackStatus: status })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }
  return new Response("Mux webhook recieved", { status: 200 });
};
