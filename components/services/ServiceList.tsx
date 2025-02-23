/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 13:22:09
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { memo } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Id } from "@/convex/_generated/dataModel"
import { Pencil, Trash2 } from "lucide-react"

interface ServiceItemProps {
    service: {
        _id: Id<"services">
        name: string
        description: string
        duration: number
        price: number
        features: string[]
    }
    onEdit: (serviceId: Id<"services">) => void
    onDelete: (serviceId: Id<"services">) => void
}

const ServiceItem = memo(({ service, onEdit, onDelete }: ServiceItemProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
            <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(service._id)} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(service._id)} className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{service.description}</p>
            <div className="flex justify-between text-sm">
                <span>{service.duration} minutes</span>
                <span className="font-medium">${service.price.toFixed(2)}</span>
            </div>
            {service.features.length > 0 && (
                <div className="space-y-1">
                    <h4 className="text-sm font-medium">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {service.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            )}
        </CardContent>
    </Card>
))

ServiceItem.displayName = "ServiceItem"

interface ServiceListProps {
    organizationId: Id<"organizations">
    categoryId?: Id<"serviceCategories">
    onEdit: (serviceId: Id<"services">) => void
    onDelete: (serviceId: Id<"services">) => void
}

export default function ServiceList({ organizationId, categoryId, onEdit, onDelete }: ServiceListProps) {
    const services = useQuery(api.services.listServices, {
        organizationId,
        categoryId,
    })

    if (!services) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceItem key={service._id} service={service} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    )
}

