/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 20:10:36
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { ServiceEditor } from "@/components/service-editor"
import { DynamicPricingCalculator } from "@/components/DynamicPricingCalculater"

export default function ServiceManagementPage({ params }: { params: { organizationId: string } }) {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Service Management</h1>
            <ServiceEditor organizationId={params.organizationId} />
            <DynamicPricingCalculator organizationId={params.organizationId} />
        </div>
    )
}