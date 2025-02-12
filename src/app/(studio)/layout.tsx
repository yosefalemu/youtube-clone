import StudioLayout from "@/modules/studio/ui/layouts/studio-layout";

export default function MainStudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudioLayout>{children}</StudioLayout>;
}
