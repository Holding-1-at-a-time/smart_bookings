/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 05:53:57
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { OrganizationProfile } from "@clerk/clerk-react";
import { JSX } from "react";


/**
 * OrganizationSettingsPage component.
 *
 * This component renders the organization settings page.
 *
 * @returns A JSX element representing the organization settings page.
 */
export default function OrganizationSettingsPage(): JSX.Element {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Organization Settings</h1>
            <OrganizationProfile
                /**
                 * Custom appearance settings for the OrganizationProfile component.
                 *
                 * @see https://clerk.dev/docs/nextjs-api-reference/components/organization-profile#appearance
                 */
                appearance={{
                    elements: {
                        /**
                         * Style for the root box element.
                         */
                        rootBox: "max-w-3xl mx-auto",
                        /**
                         * Style for the card element.
                         */
                        card: "shadow-md rounded-lg",
                    },
                }}
            />
        </div>
    );
}
