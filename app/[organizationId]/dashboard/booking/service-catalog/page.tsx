/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:52:23
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Service {
    id: string
    name: string
    description: string
    price: number
    duration: number
}

export default function ServiceCatalog() {
    const { organizationId } = useParams()
    const router = useRouter()
    const [services, setServices] = useState<Service[]>([])

    const servicesData = useQuery(api.services.getServices, { organizationId: organizationId as string })

    useEffect(() => {
        if (servicesData) {
            setServices(servicesData)
        }
    }, [servicesData])

    const handleBookService = (serviceId: string) => {
        router.push(`/${organizationId}/booking/booking-form?serviceId=${serviceId}`)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <Card key={service.id}>
                    <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">${service.price}</p>
                        <p>Duration: {service.duration} minutes</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleBookService(service.id)}>Book Now</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

