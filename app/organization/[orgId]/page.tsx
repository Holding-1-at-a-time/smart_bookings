/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 15:39:27
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * OrganizationLayout component.
 * 
 * This component provides a layout for organization-related pages, including a sidebar with the OrganizationProfile component.
 * 
 * The layout is composed of a flex container with two children: the sidebar and the main content area.
 * The sidebar is rendered as an `aside` element with a fixed width, and contains the OrganizationProfile component.
 * The main content area is rendered as a `main` element and takes up the remaining space.
 * 
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} A JSX element representing the organization layout.
 */
import { OrganizationProfile } from "@clerk/clerk-react";
import React from "react";

/**
 * The OrganizationLayout component renders a layout for organization-related pages.
 * It includes a sidebar with the OrganizationProfile component and a main content area.
 * 
 * The component accepts a single prop, `children`, which is the content to be rendered within the layout.
 * The component returns a JSX element representing the organization layout.
 * 
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @returns {JSX.Element} A JSX element representing the organization layout.
 */
export default function OrganizationLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* The sidebar is rendered as an `aside` element with a fixed width */}
            <aside className="w-64 bg-gray-800 p-4">
                {/* The OrganizationProfile component is rendered within the sidebar */}
                <OrganizationProfile
                    /**
                     * The appearance of the OrganizationProfile component is customized using the `appearance` prop.
                     * The `elements` property is used to customize the styles of the component's elements.
                     * The `rootBox` property is used to customize the styles of the root element of the component.
                     * The `card` property is used to customize the styles of the card element of the component.
                     * The `navbar` property is used to customize the styles of the navbar element of the component.
                     * The `navbarButton` property is used to customize the styles of the navbar button element of the component.
                     */
                    appearance={{
                        elements: {
                            rootBox: "bg-gray-800 text-white",
                            card: "bg-gray-700",
                            navbar: "bg-gray-800",
                            navbarButton: "text-white hover:bg-gray-700",
                        },
                    }}
                />
            </aside>
            {/* The main content area is rendered as a `main` element and takes up the remaining space */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}

