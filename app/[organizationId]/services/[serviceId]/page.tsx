/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:05:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage({ params }: { params: { organizationId: string } }) {
    // This is a placeholder. In a real application, you would fetch the services from your API.
    const services = [
        { id: 1, name: "Basic Wash", price: 20 },
        { id: 2, name: "Full Detail", price: 100 },
        { id: 3, name: "Interior Clean", price: 50 },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs />
            <h1 className="text-3xl font-bold mb-6">Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                        <p className="text-gray-600 mb-4">${service.price}</p>
                        <Link href={`/${params.organizationId}/services/${service.id}`}>
                            <Button>View Details</Button>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <Link href={`/${params.organizationId}/settings/service-configuration`}>
                    <Button>Manage Services</Button>
                </Link>
            </div>
        </div>
    )
}