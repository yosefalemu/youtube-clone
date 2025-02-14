import StudioSection from "../section/studio-section";

export default function StudioView() {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel content</h1>
        <p className="text-xs text-muted-foreground">
          Manage your channel content and video.
        </p>
      </div>
      <StudioSection />
    </div>
  );
}
