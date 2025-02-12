"use client";

import { trpc } from "@/trpc/client";

export default function ClientComponent() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "YOSEF" });
  return <div>{data.greeting}</div>;
}
