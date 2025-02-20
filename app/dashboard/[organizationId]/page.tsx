/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:21:12
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { auth, currentUser } from "@clerk/nextjs";

export default async function DashboardPage() {
    const { userId, orgId } = auth();
    const user = await currentUser();

    if (!userId || !orgId) {
        return <div>Access denied</div>;
    }

    return (
        <div>
            <h1>Welcome to the Dashboard, {user?.firstName}!</h1>
            <p>Organization ID: {orgId}</p>
        </div>
    );
}