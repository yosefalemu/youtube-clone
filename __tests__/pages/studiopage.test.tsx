import StudioPage from "@/app/(studio)/studio/page";
import { HydrateClient, trpc } from "@/trpc/server";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@/trpc/server", () => ({
  trpc: {
    studio: {
      getMany: {
        prefetchInfinite: jest.fn(),
      },
    },
  },
  HydrateClient: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/modules/studio/ui/views/studio-view", () => {
  const MockStudioView = () => (
    <HydrateClient>
      <div data-testid="studio-view">Studio Content</div>
    </HydrateClient>
  );
  return MockStudioView;
});

describe("StudioPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders StudioView with HydratedClient", async () => {
    render(StudioPage());
    const StudioView = await screen.findByTestId("studio-view");
    expect(StudioView).toBeInTheDocument();
    expect(StudioView).toHaveTextContent("Studio Content");
  });
  it("prefetch infinite studi data with correct limit", async () => {
    render(StudioPage());
    expect(trpc.studio.getMany.prefetchInfinite).toHaveBeenCalledWith({
      limit: 5,
    });
    expect(trpc.studio.getMany.prefetchInfinite).toHaveBeenCalledTimes(1);
  });
  it("handles async renedring correctly", async () => {
    render(StudioPage());
    expect(screen.getByTestId("studio-view")).toBeInTheDocument();
    expect(screen.getByText("Studio Content")).toBeInTheDocument();
  });
});
