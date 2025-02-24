/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:40:08
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

export default function ServiceDetailsPage() {
    const { organizationId, serviceId } = useParams()
    const service = useQuery(api.services.getServiceDetails, {
        organizationId: organizationId as string,
        serviceId: serviceId as string,
    })

    if (!service) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>{service.description}</p>
                <p className="font-bold">Price: ${service.price}</p>
                <p>Duration: {service.duration} minutes</p>
                <h3 className="text-xl font-semibold">What's Included:</h3>
                <ul className="list-disc list-inside">
                    {service.inclusions.map((inclusion, index) => (
                        <li key={index}>{inclusion}</li>
                    ))}
                </ul>
                <Button asChild className="mt-4">
                    <Link href={`/${organizationId}/booking?serviceId=${serviceId}`}>Book This Service</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

