/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:13:22
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useOrganization, SignedIn, ClerkLoading, ClerkLoaded, OrganizationSwitcher, UserButton, SignedOut } from "@clerk/clerk-react";
import { Sidebar, Link, Home, Calendar, Briefcase, Users, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { JSX } from "react";

/**
 * DashboardLayout component.
 *
 * This component renders a layout for the dashboard pages.
 * It includes a sidebar with a menu and a main content area.
 *
 * The component accepts a single prop, `children`, which is the content to be rendered within the layout.
 *
 * @param {{ children: React.ReactNode }} props - The component props.
 * @returns {JSX.Element} A JSX element representing the dashboard layout.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }): JSX.Element {
    /**
     * Get the current organization from the Clerk context.
     */
    const { organization } = useOrganization();

    return (
        <SignedIn>
            <ClerkLoading>
                {/* Show a loading spinner while Clerk is loading */}
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                </div>
            </ClerkLoading>
            <ClerkLoaded>
                {/* Show the dashboard layout when Clerk is loaded */}
                <div className="flex h-screen bg-gray-900 text-white">
                    <Sidebar>
                        <SidebarHeader>
                            {/* Show the organization switcher in the sidebar header */}
                            <OrganizationSwitcher
                                appearance={{
                                    elements: {
                                        rootBox: "flex",
                                        organizationSwitcherTrigger: "bg-gray-700 text-white px-4 py-2 rounded-md w-full",
                                    },
                                }}
                            />
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {/* Show the menu items in the sidebar */}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/dashboard/${organization?.id}`}>
                                                    <Home className="mr-2" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/dashboard/${organization?.id}/bookings`}>
                                                    <Calendar className="mr-2" />
                                                    <span>Bookings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/dashboard/${organization?.id}/services`}>
                                                    <Briefcase className="mr-2" />
                                                    <span>Services</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/dashboard/${organization?.id}/members`}>
                                                    <Users className="mr-2" />
                                                    <span>Members</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={`/dashboard/${organization?.id}/settings`}>
                                                    <Settings className="mr-2" />
                                                    <span>Settings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="bg-gray-800 p-4 flex justify-between items-center">
                            {/* Show the header with the title and user button */}
                            <h1 className="text-2xl font-bold">Smart Booking&apos;s</h1>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10",
                                    },
                                }}
                            />
                        </header>
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">{children}</main>
                    </div>
                </div>
            </ClerkLoaded>
            <SignedOut>{redirect("/")}</SignedOut>
        </SignedIn>
    );
}

