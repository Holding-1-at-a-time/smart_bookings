/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:37:19
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import ErrorBoundary from "@/components/ErrorBoundery"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { useOrganization } from "@clerk/clerk-react"
import { useQuery, useMutation } from "convex/react"
import React from "react"
import { Button } from "react-day-picker"



export default function ServicesPage() {
    const { organization } = useOrganization()
    const { toast } = useToast()
    const [newServiceName, setNewServiceName] = React.useState("")
    const [newServicePrice, setNewServicePrice] = React.useState("")
    const [newServiceDuration, setNewServiceDuration] = React.useState("")

    const services = useQuery(api.services.listServices, {
        organizationId: organization?.id ?? "",
    })

    const addService = useMutation(api.services.addService)
    const deleteService = useMutation(api.services.deleteService)

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!organization) return

        try {
            await addService({
                organizationId: organization.id,
                name: newServiceName,
                price: Number.parseFloat(newServicePrice),
                duration: Number.parseInt(newServiceDuration),
            })
            setNewServiceName("")
            setNewServicePrice("")
            setNewServiceDuration("")
            toast({
                title: "Service added",
                description: "The new service has been successfully added.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add the service. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        try {
            await deleteService({ serviceId })
            toast({
                title: "Service deleted",
                description: "The service has been successfully deleted.",
            })
        } catch (error) {
            console.error("Failed to delete service:", error);
            toast({
                title: "Error",
                description: "Failed to delete the service. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!organization) {
        return <div>Loading...</div>
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Services</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddService} className="space-y-4">
                            <Input
                                placeholder="Service Name"
                                value={newServiceName}
                                onChange={(e) => setNewServiceName(e.target.value)}
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Price"
                                value={newServicePrice}
                                onChange={(e) => setNewServicePrice(e.target.value)}
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Duration (minutes)"
                                value={newServiceDuration}
                                onChange={(e) => setNewServiceDuration(e.target.value)}
                                required
                            />
                            <Button type="submit">Add Service</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {services === undefined ? (
                            <div>Loading...</div>
                        ) : services.length > 0 ? (
                            <ul className="space-y-2">
                                {services.map((service: { _id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: number; duration: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
                                    <li key={service._id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                ${service.price.toFixed(2)} - {service.duration} minutes
                                            </p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)}>
                                            Delete
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No services available</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ErrorBoundary>
    )
}

