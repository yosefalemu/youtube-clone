//Mock the videoview component

import VideoPage from "@/app/(studio)/studio/videos/[videoId]/page";
import { trpc } from "@/trpc/server";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@/trpc/server", () => ({
  trpc: {
    studio: {
      getOne: {
        prefetch: jest.fn(),
      },
    },
    categories: {
      getMany: {
        prefetch: jest.fn(),
      },
    },
  },
  HydrateClient: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock("@/modules/studio/ui/views/video-view", () => {
  const MockVideoView = ({ videoId }: { videoId: string }) => (
    <div data-testid="video-view">video:{videoId}</div>
  );
  return MockVideoView;
});

describe("VideoView", () => {
  const mockVideoId = "test-video-123";
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders video view with correct videoId", async () => {
    const params = Promise.resolve({ videoId: mockVideoId });
    render(await VideoPage({ params }));
    const videoView = await screen.findByTestId("video-view");
    expect(videoView).toBeInTheDocument();
    expect(videoView).toHaveTextContent(`video:${mockVideoId}`);
  });
  it("prefetch video data with correct videoId", async () => {
    const params = Promise.resolve({ videoId: mockVideoId });
    await VideoPage({ params });
    expect(trpc.studio.getOne.prefetch).toHaveBeenCalledWith({
      id: mockVideoId,
    });
  });
  it("prefetch categories data", async () => {
    const params = Promise.resolve({ videoId: mockVideoId });
    await VideoPage({ params });
    expect(trpc.categories.getMany.prefetch).toHaveBeenCalled();
  });
});
