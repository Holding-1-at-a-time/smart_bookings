/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:22:13
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <CreateOrganization />
        </div>
    );
}