/**
 * OrganizationSettingsPage component.
 *
 * This component renders the OrganizationProfile component from @clerk/nextjs with custom styles.
 *
 * The component is styled with a dark theme for the background, header, and form elements.
 *
 * @returns {JSX.Element} A JSX element representing the Organization Settings page.
 * @description      : 
 * @author           : rrome
 * @group            : 
 * @created          : 20/02/2025 - 16:04:42
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/02/2025
 * - Author          : rrome
 * - Modification    : 
 */
import { OrganizationProfile } from "@clerk/nextjs"
import { JSX } from "react/jsx-runtime"

export default function OrganizationSettingsPage(): JSX.Element {
    return (
        <div className="bg-gray-900">
            {/* Page title */}
            <h1 className="text-3xl font-bold mb-6">Organization Settings</h1>
            {/* OrganizationProfile component with custom appearance */}
            <OrganizationProfile
                appearance={{
                    elements: {
                        card: "bg-gray-800 border-gray-700", // Style for the card element
                        navbar: "bg-gray-800", // Style for the navbar element
                        navbarButton: "text-white hover:bg-gray-700", // Style for navbar buttons
                        headerTitle: "text-white", // Style for the header title
                        headerSubtitle: "text-gray-300", // Style for the header subtitle
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white", // Style for the primary form button
                        formFieldLabel: "text-gray-300", // Style for form field labels
                        formFieldInput: "bg-gray-700 border-gray-600 text-white", // Style for form field inputs
                    },
                }}
            />
        </div>
    )
}

