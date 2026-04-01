"use client";

import * as React from "react"
import { IconDeviceAnalytics, IconSettings, IconShoppingBagCheck, IconTemplate, IconUsers, type Icon } from "@tabler/icons-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@repo/ui"
import { usePathname, useRouter } from "next/navigation";

// This is sample data.
const data = {
    navigation: [
        {
            title: "Application Menu",
            url: "#",
            items: [
                {
                    icon: IconUsers,
                    title: "Profile",
                    url: "/dashboard/profile",
                },
                {
                    icon: IconDeviceAnalytics,
                    title: "Analytics",
                    url: "/dashboard/analytics",
                },
                {
                    icon: IconShoppingBagCheck,
                    title: "Subscription",
                    url: "/dashboard/subscription",
                },
                {
                    icon: IconSettings,
                    title: "Settings",
                    url: "/dashboard/settings",
                },
            ],
        },
    ],
};

const Logo: React.FC<{ size?: number; white?: boolean }> = ({ size = 24, white = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 40 40">
        <path fill={white ? "#fff" : "#F4500A"} d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z" />
        <path fill={white ? "#fff" : "#F4500A"} d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
);


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname().split('/').filter(Boolean);
    const currentPath = pathname[pathname.length - 1];
    const router = useRouter();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div onClick={() => router.push('/')} className='w-full flex justify-start items-center px-3 gap-3 cursor-pointer'>
                                <div className="bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm">
                                    <Logo size={20} />
                                </div>
                                <div className="flex flex-col gap-1 leading-none">
                                    <span className="font-medium font-sans text-[14px] tracking-tight">Elowen AI</span>
                                    {/* <span className="font-normal text-[11px]">{user?.user?.name}</span> */}
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navigation.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url} className="font-medium">
                                        {item.title}
                                    </a>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item: { title: string, url: string, icon: Icon }) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild isActive={currentPath.toLowerCase() === item.title.toLowerCase() ? true : false}>
                                                    <div>
                                                        <item.icon /><a href={item.url}>{item.title}</a>
                                                    </div>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}