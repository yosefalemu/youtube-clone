"use client";
import ResponsiveModal from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import StudioUploader from "../studio-uploader";

export default function StudioUploadModal() {
  const utils = trpc.useUtils();
  const create = trpc.video.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video created");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return (
    <>
      <ResponsiveModal
        title="Upload video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endPoint={create.data?.url} onSuccess={() => {}} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
}
