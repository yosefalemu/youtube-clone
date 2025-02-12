import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ClientComponent from "./client";

export default async function Home() {
  void trpc.hello.prefetch({ text: "YOSEF" });
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientComponent />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
