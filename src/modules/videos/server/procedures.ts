import db from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema/videos";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [{ language_code: "en", name: "English" }],
          },
        ],
      },
      cors_origin: "*", //TODO::in production set to url
    });
    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();
    return { video, url: upload.url };
  }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video id is required",
        });
      }
      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      if (!updatedVideo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video not found",
        });
      }
      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;
      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();
      if (!removedVideo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video not found",
        });
      }
      return removedVideo;
    }),
  restoreThumbnailUrl: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));
      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      if (!existingVideo.thumbnailKey) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const utapi = new UTApi();
      await utapi.deleteFiles(existingVideo.thumbnailKey);
      const thumbnail_url = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const preview_url = `https://image.mux.com/${existingVideo.muxPlaybackId}/animated.gif`;
      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailUrl: thumbnail_url,
          thumbnailKey: null,
          previewUrl: preview_url,
          previewKey: null,
        })
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();
      if (!updatedVideo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      return updatedVideo;
    }),
});
