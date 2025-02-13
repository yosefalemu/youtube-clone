import StudioView from "@/modules/studio/ui/view/studio-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";

export default function StudioPage() {
  void trpc.studio.getMany.prefetchInfinite({ limit: 5 });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
