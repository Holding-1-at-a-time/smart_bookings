/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 06:15:57
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Id } from "@/convex/_generated/dataModel";
import DataComponent from "./DataComponent";

interface DataPageProps {
    params: {
        organizationId: string;
    };
}

export default async function DataPage({ params }: DataPageProps) {
    const organizationId = params.organizationId as Id<"organizations">;

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Organization Data</h1>
            <DataComponent organizationId={organizationId} />
        </main>
    );
}