/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:30:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationSettingsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Organization Settings</h1>
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: "max-w-3xl mx-auto",
                        card: "shadow-md rounded-lg",
                    },
                }}
            />
        </div>
    );
}