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

import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";


export default async function DashboardPage({ params }: { params: { organizationId: string } }) {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return <div>Access denied! Sign-In to view this page</div>;
    }

    if (orgId !== params.organizationId) {
        notFound();
    }

    const user = await currentUser();

    return (
        <div>
            <h1>Welcome, {user?.firstName} to your Dashboard!</h1>
            <p>Organization ID: {orgId}</p>
        </div>
    );
}