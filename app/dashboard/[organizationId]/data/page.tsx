/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 21:08:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type { Id } from "@/convex/_generated/dataModel"
import DataComponent from "./DataComponent"

export default async function DataPage({ params }: { params: { organizationId: string } }) {
    const organizationId = params.organizationId as Id<"organizations">

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Organization Data</h1>
            <DataComponent organizationId={organizationId} />
        </main>
    )
}