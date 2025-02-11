"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

export default function MainSection() {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const items = [
    { title: "Home", url: "/", icon: HomeIcon, auth: false },
    {
      title: "Subscriptions",
      url: "/feed/subscriptions",
      icon: PlaySquareIcon,
      auth: true,
    },
    { title: "Trending", url: "/feed/trending", icon: FlameIcon, auth: false },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} //TODO:: Add active state
                onClick={(e) => {
                  console.log(
                    "Clicked:",
                    item.title,
                    "Requires Auth:",
                    item.auth,
                    "Is Signed In:",
                    isSignedIn
                  );
                  if (!isSignedIn && item.auth) {
                    e.preventDefault();
                    return clerk.openSignIn();
                  }
                }}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
