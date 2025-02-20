/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:23:25
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function OrganizationSelector() {
    return (
        <OrganizationSwitcher
            appearance={{
                elements: {
                    rootBox: "flex justify-center",
                    organizationSwitcherTrigger: "bg-white shadow-sm rounded-md px-4 py-2",
                },
            }}
        />
    );
}