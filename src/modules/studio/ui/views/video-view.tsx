import FormSection from "../section/form-section";

interface VideoViewProps {
  videoId: string;
}
export default function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="px-4 pt-2.5 max-w-screen-lg">
      <FormSection videoId={videoId} key={videoId} />
    </div>
  );
}
