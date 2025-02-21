/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 07:57:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { redirect } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import AvailabilityManager from "@/components/availability/AvailabilityManager"
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function AvailabilityPage({ params }: { params: { organizationId: string } }) {
    const { userId, orgId } = await auth()

    // Get the Backend API User object when you need access to the user's information

    const user = await currentUser()

    if (!userId || !orgId) {
        redirect("/")
    }

    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Availability Management</h1>
            <AvailabilityManager organizationId={params.organizationId as Id<"organizations">} />
        </div>
    )
}

