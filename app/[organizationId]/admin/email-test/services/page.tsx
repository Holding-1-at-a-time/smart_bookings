/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:06:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { ServiceEditor } from "@/components/service-editor"
import { DynamicPricingCalculator } from "@/components/dynamic-pricing-calculator"

export default function ServiceManagementPage() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Service Management</h1>
            <ServiceEditor />
            <DynamicPricingCalculator />
        </div>
    )
}

