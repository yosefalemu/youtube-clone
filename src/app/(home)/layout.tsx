import HomeLayout from "@/modules/home/ui/layouts/home-layout";

export default function HomeGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HomeLayout>{children}</HomeLayout>;
}
