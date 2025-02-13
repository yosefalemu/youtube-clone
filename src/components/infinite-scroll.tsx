"use client";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronsDownIcon, Loader2Icon } from "lucide-react";
import { easeInOut, motion } from "framer-motion";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}
export default function InfiniteScroll({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && !isManual && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [
    isIntersecting,
    isManual,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        <Button
          onClick={fetchNextPage}
          disabled={isFetchingNextPage}
          variant={"secondary"}
          size={"lg"}
          className="rounded-full bg-transparent hover:bg-transparent shadow-none"
        >
          {isFetchingNextPage ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <motion.div
              animate={{ y: [0, -5, 0, 5] }}
              transition={{ repeat: Infinity, duration: 1, ease: easeInOut }}
            >
              <ChevronsDownIcon className="animate-accordion-down" />
            </motion.div>
          )}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
}
