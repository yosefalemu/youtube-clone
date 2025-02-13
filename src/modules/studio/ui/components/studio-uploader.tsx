import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";
interface StudioUploaderProps {
  endPoint?: string | null;
  onSuccess: () => void;
}
export default function StudioUploader({
  onSuccess,
  endPoint,
}: StudioUploaderProps) {
  return (
    <div>
      <MuxUploader
        onSuccess={onSuccess}
        endpoint={endPoint}
        id="video-uploader"
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-3000 ease-in-out" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">Drag and drop video file to upload</p>
            <p className="text-sm text-muted-foreground">
              Your videos will be private until you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader="video-uploader">
            <Button type="button" className="rounded-full">
              Select files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader="video-uploader" className="text-sm" />
        <MuxUploaderProgress
          muxUploader="video-uploader"
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader="video-uploader" type="bar" />
      </MuxUploaderDrop>
    </div>
  );
}
