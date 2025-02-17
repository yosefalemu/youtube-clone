import db from "@/db";
import { videos } from "@/db/schema/videos";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;

  const existingVideo = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!existingVideo) {
      throw new Error("Video not found");
    }
    return existingVideo;
  });
  const generatedTitle = await context.api.openai.call("generate-title", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: "Hello every one in this cource we will build youtube clone",
        },
      ],
    },
  });
  console.log({ generatedTitle });
  const title = generatedTitle.body.choices[0].message.content;
  console.log({title})
  await context.run("generate-title", async () => {
    console.log("initial step ran");
    const [updatedVideo] = await db
      .update(videos)
      .set({ title: title || videos.title })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId)
        )
      )
      .returning();
    return updatedVideo;
  });
});
