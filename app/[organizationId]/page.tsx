/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:39:30
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
    const { organizationId } = useParams()
    const businessInfo = useQuery(api.organizationSettings.getOrganizationSettings);
    const featuredServices = useQuery(api.services.getFeaturedServices, { organizationId: organizationId as string })

    if (!businessInfo) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-8">
            <section className="text-center">
                <h1 className="text-4xl font-bold mb-4">{businessInfo.name}</h1>
                <p className="text-xl mb-6">{businessInfo.description}</p>
                <Button asChild>
                    <Link href={`/${organizationId}/booking`}>Book Now</Link>
                </Button>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Our Featured Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredServices?.map((service) => (
                        <Card key={service.id}>
                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{service.description}</p>
                                <p className="font-bold mt-2">Price: ${service.price}</p>
                                <Button asChild className="mt-4">
                                    <Link href={`/${organizationId}/services/${service.id}`}>Learn More</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>AI-powered scheduling for optimal appointment times</li>
                    <li>Expert detailing services for all vehicle types</li>
                    <li>Eco-friendly products and practices</li>
                    <li>Convenient online booking and customer dashboard</li>
                </ul>
            </section>
        </div>
    )
}

