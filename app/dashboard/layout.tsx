/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 15:54:22
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import Link from 'next/link'

/**
 * The DashboardLayout component renders a layout for the dashboard pages.
 * It includes a header with a navigation menu and an organization switcher.
 * The component accepts a single prop, `children`, which is the content to be rendered within the layout.
 * The component returns a JSX element representing the dashboard layout.
 * @param {{ children: React.ReactNode }} props - The component props.
 * @returns {JSX.Element} A JSX element representing the dashboard layout.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* The header includes a navigation menu and an organization switcher */}
            <header className="bg-gray-800 p-4 flex justify-between items-center">
                {/* The navigation menu is rendered as a Link component */}
                <Link href="/dashboard" className="text-2xl font-bold">
                    Smart Booking&apos;s
                </Link>
                {/* The organization switcher is rendered as an OrganizationSwitcher component */}
                <div className="flex items-center space-x-4">
                    <OrganizationSwitcher
                        /**
                         * The appearance of the OrganizationSwitcher component is customized using the `appearance` prop.
                         * The `elements` property is used to customize the styles of the component's elements.
                         * The `rootBox` property is used to customize the styles of the root element of the component.
                         * The `organizationSwitcherTrigger` property is used to customize the styles of the organization switcher trigger element of the component.
                         */
                        appearance={{
                            elements: {
                                rootBox: "flex",
                                organizationSwitcherTrigger: "bg-gray-700 text-white px-4 py-2 rounded-md",
                            },
                        }}
                    />
                    {/* The user button is rendered as a UserButton component */}
                    <UserButton
                        /**
                         * The appearance of the UserButton component is customized using the `appearance` prop.
                         * The `elements` property is used to customize the styles of the component's elements.
                         * The `avatarBox` property is used to customize the styles of the avatar box element of the component.
                         */
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            },
                        }}
                    />
                </div>
            </header>
            {/* The main content area is rendered as a main element and takes up the remaining space */}
            <main className="p-8">{children}</main>
        </div>
    )
}

