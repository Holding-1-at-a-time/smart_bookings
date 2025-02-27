/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 21:37:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServicesPage() {
    const services = useQuery(api.services.list)

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Our Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services === undefined ? (
                    <>
                        <ServiceSkeleton />
                        <ServiceSkeleton />
                        <ServiceSkeleton />
                    </>
                ) : (
                    services.map((service) => (
                        <Card key={service._id}>
                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">${service.basePrice.toFixed(2)}</p>
                                <p>Duration: {service.duration} minutes</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Book Now</Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

function ServiceSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

