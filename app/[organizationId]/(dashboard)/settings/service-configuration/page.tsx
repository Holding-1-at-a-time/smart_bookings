/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:33:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Service {
    id: string
    name: string
    description: string
    price: number
    duration: number
}

export default function ServiceConfiguration() {
    const { organizationId } = useParams()
    const [services, setServices] = useState<Service[]>([])
    const [newService, setNewService] = useState<Omit<Service, "id">>({
        name: "",
        description: "",
        price: 0,
        duration: 0,
    })

    const existingServices = useQuery(api.services.getServices, { organizationId: organizationId as string })
    const addService = useMutation(api.services.addService)
    const updateService = useMutation(api.services.updateService)
    const deleteService = useMutation(api.services.deleteService)

    useEffect(() => {
        if (existingServices) {
            setServices(existingServices)
        }
    }, [existingServices])

    const handleAddService = async () => {
        try {
            const addedService = await addService({
                organizationId: organizationId as string,
                ...newService,
            })
            setServices([...services, { ...newService, id: addedService.id }])
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
                id: service.id,
                organizationId: organizationId as string,
                ...service,
            })
            setServices(services.map((s) => (s.id === service.id ? service : s)))
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

    const handleDeleteService = async (id: string) => {
        try {
            await deleteService({ id, organizationId: organizationId as string })
            setServices(services.filter((s) => s.id !== id))
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

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Service Configuration</h2>

            {/* Add new service form */}
            <div className="bg-secondary p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-4">Add New Service</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="newServiceName">Service Name</Label>
                        <Input
                            id="newServiceName"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newServiceDescription">Description</Label>
                        <Textarea
                            id="newServiceDescription"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newServicePrice">Price ($)</Label>
                        <Input
                            id="newServicePrice"
                            type="number"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: Number.parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newServiceDuration">Duration (minutes)</Label>
                        <Input
                            id="newServiceDuration"
                            type="number"
                            value={newService.duration}
                            onChange={(e) => setNewService({ ...newService, duration: Number.parseInt(e.target.value) })}
                        />
                    </div>
                    <Button onClick={handleAddService}>Add Service</Button>
                </div>
            </div>

            {/* Existing services list */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Existing Services</h3>
                {services.map((service) => (
                    <div key={service.id} className="bg-secondary p-4 rounded-md">
                        <Input
                            value={service.name}
                            onChange={(e) => handleUpdateService({ ...service, name: e.target.value })}
                            className="mb-2"
                        />
                        <Textarea
                            value={service.description}
                            onChange={(e) => handleUpdateService({ ...service, description: e.target.value })}
                            className="mb-2"
                        />
                        <Input
                            type="number"
                            value={service.price}
                            onChange={(e) => handleUpdateService({ ...service, price: Number.parseFloat(e.target.value) })}
                            className="mb-2"
                        />
                        <Input
                            type="number"
                            value={service.duration}
                            onChange={(e) => handleUpdateService({ ...service, duration: Number.parseInt(e.target.value) })}
                            className="mb-2"
                        />
                        <Button variant="destructive" onClick={() => handleDeleteService(service.id)}>
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

