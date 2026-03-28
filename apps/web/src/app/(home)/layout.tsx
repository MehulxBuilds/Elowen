import AppHeader from '@/components/dashboard/app-header';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { requireAuth } from '@/lib/auth-utils';
import { SidebarInset, SidebarProvider } from '@repo/ui';
import React from 'react'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout;