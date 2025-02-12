import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function StudioSidebarHeader() {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center p-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );
  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={"Your profile"}>
          <Link href="/users/current">
            <UserAvatar
              imageUrl={user.imageUrl}
              size="xs"
              name={user.fullName ?? "User"}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center p-4">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName ?? "User"}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-sm font-md">Your Profile</p>
        <p className="text-xs text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
}
