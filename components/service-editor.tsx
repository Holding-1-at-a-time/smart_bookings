/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 16:54:38
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface Service {
    _id: string
    name: string
    description: string
    price: number
    duration: number
}

export function ServiceEditor({ organizationId }: { organizationId: string }) {
    const { toast } = useToast()
    const [services, setServices] = useState<Service[]>([])
    const [newService, setNewService] = useState<Omit<Service, "_id">>({
        name: "",
        description: "",
        price: 0,
        duration: 0,
    })

    const existingServices = useQuery(api.services.list, { organizationId })
    const addService = useMutation(api.services.add)
    const updateService = useMutation(api.services.update)
    const deleteService = useMutation(api.services.delete)

    useEffect(() => {
        if (existingServices) {
            setServices(existingServices)
        }
    }, [existingServices])

    const handleAddService = async () => {
        try {
            const addedService = await addService({
                organizationId,
                ...newService,
            })
            setServices([...services, { ...newService, _id: addedService._id }])
            setNewService({ name: "", description: "", price: 0, duration: 0 })
            toast({
                title: "Service added",
                description: "New service has been successfully added.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add new service. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleUpdateService = async (service: Service) => {
        try {
            await updateService({
                organizationId,
                serviceId: service._id,
                ...service,
            })
            setServices(services.map((s) => (s._id === service._id ? service : s)))
            toast({
                title: "Service updated",
                description: "Service has been successfully updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update service. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        try {
            await deleteService({ organizationId, serviceId })
            setServices(services.filter((s) => s._id !== serviceId))
            toast({
                title: "Service deleted",
                description: "Service has been successfully deleted.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete service. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!existingServices) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Service Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-10 w-[100px]" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name</Label>
                            <Input
                                id="name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={newService.duration}
                                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAddService}>Add Service</Button>
                </div>
                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold">Existing Services</h3>
                    {services.map((service) => (
                        <Card key={service._id}>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`name-${service._id}`}>Service Name</Label>
                                        <Input
                                            id={`name-${service._id}`}
                                            value={service.name}
                                            onChange={(e) => handleUpdateService({ ...service, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`price-${service._id}`}>Price ($)</Label>
                                        <Input
                                            id={`price-${service._id}`}
                                            type="number"
                                            value={service.price}
                                            onChange={(e) => handleUpdateService({ ...service, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`duration-${service._id}`}>Duration (minutes)</Label>
                                        <Input
                                            id={`duration-${service._id}`}
                                            type="number"
                                            value={service.duration}
                                            onChange={(e) => handleUpdateService({ ...service, duration: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor={`description-${service._id}`}>Description</Label>
                                    <Textarea
                                        id={`description-${service._id}`}
                                        value={service.description}
                                        onChange={(e) => handleUpdateService({ ...service, description: e.target.value })}
                                    />
                                </div>
                                <Button variant="destructive" onClick={() => handleDeleteService(service._id)} className="mt-4">
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

