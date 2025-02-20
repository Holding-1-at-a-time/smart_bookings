/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:06:03
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { OrganizationList } from "@clerk/clerk-react";
import { JSX } from "react";

/**
 * MembersPage
 *
 * This page renders the OrganizationList component from @clerk/nextjs.
 * The component is styled with custom styles for the card, navbar, header title, header subtitle, primary form button, form field labels, and form field inputs.
 *
 * @returns {JSX.Element} A JSX element representing the OrganizationList component.
 */
export default function MembersPage(): JSX.Element {
    return (
        <div className="bg-gray-900">
            <h1 className="text-3xl font-bold mb-6">Organization Members</h1>
            <OrganizationList
                // Custom styles for the OrganizationList component
                appearance={{
                    elements: {
                        // Style for the card element
                        card: "bg-gray-800 border-gray-700",
                        // Style for the navbar element
                        navbar: "bg-gray-800",
                        // Style for the navbar buttons
                        navbarButton: "text-white hover:bg-gray-700",
                        // Style for the header title
                        headerTitle: "text-white",
                        // Style for the header subtitle
                        headerSubtitle: "text-gray-300",
                        // Style for the primary form button
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        // Style for the form field labels
                        formFieldLabel: "text-gray-300",
                        // Style for the form field inputs
                        formFieldInput: "bg-gray-700 border-gray-600 text-white",
                    },
                }}
            />
        </div>
    )
}

