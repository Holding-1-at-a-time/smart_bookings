/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:27:27
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/


import LoadingSpinner from "@/components/LoadingSpinner";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";


/**
  * Provides a layout for authentication pages.
  * This layout handles the loading state and renders the provided children when Clerk is loaded.
  * @param {{ children: React.ReactNode }} props - The component props.
  * @param {React.ReactNode} props.children - The content to be rendered within the layout.
  * @returns {JSX.Element} The rendered layout.
  */


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <ClerkLoading>
                    <LoadingSpinner />
                </ClerkLoading>
                <ClerkLoaded>{children}</ClerkLoaded>
            </div>
        </div>
    );
}