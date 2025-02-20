/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:07:29
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { SignedIn, ClerkLoading, ClerkLoaded, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * DashboardLayout
 *
 * This is the layout component for the dashboard pages.
 *
 * The component renders the children prop when the user is signed in.
 * If the user is not signed in, it redirects to the root path.
 *
 * @param {{ children: React.ReactNode }} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} The rendered layout.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* If the user is signed in, render the children prop */}
            <SignedIn>
                {/* If Clerk is loading, render a loading spinner */}
                <ClerkLoading>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </ClerkLoading>
                {/* If Clerk is loaded, render the children prop */}
                <ClerkLoaded>{children}</ClerkLoaded>
            </SignedIn>
            {/* If the user is not signed in, redirect to the root path */}
            <SignedOut>{redirect("/")}</SignedOut>
        </>
    )
}

