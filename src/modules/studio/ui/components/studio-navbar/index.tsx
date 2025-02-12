import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/modules/auth/ui/auth-button";
import StudioUploadModal from "./studio-upload-modal";

export default function StudioNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="" />
          <Link href="/studio">
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo.png" width={32} height={32} alt="Logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        <div className="max-w-[720px] mx-auto flex-1 flex justify-center">
          <div />
        </div>
        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
