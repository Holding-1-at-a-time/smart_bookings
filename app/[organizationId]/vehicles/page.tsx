/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:25:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Vehicle {
    id: string
    make: string
    model: string
    year: number
    licensePlate: string
}

export default function VehiclesPage() {
    const { organizationId } = useParams()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", licensePlate: "" })

    const vehiclesData = useQuery(api.vehicles.listVehicles, { organizationId: organizationId as string })
    const addVehicle = useMutation(api.vehicles.addVehicle)

    useEffect(() => {
        if (vehiclesData) {
            setVehicles(vehiclesData)
        }
    }, [vehiclesData])

    const handleAddVehicle = async () => {
        try {
            await addVehicle({
                organizationId: organizationId as string,
                ...newVehicle,
                year: Number.parseInt(newVehicle.year),
            })
            setNewVehicle({ make: "", model: "", year: "", licensePlate: "" })
            toast({
                title: "Vehicle added",
                description: "New vehicle has been successfully added.",
            })
        } catch (error) {
            console.error("Error adding vehicle:", error)
            toast({
                title: "Error",
                description: "Failed to add new vehicle. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Make"
                            value={newVehicle.make}
                            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                        />
                        <Input
                            placeholder="Model"
                            value={newVehicle.model}
                            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                        />
                        <Input
                            placeholder="Year"
                            value={newVehicle.year}
                            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                        />
                        <Input
                            placeholder="License Plate"
                            value={newVehicle.licensePlate}
                            onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAddVehicle} className="mt-4">
                        Add Vehicle
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="flex justify-between items-center p-4 border rounded">
                                <div>
                                    <h3 className="font-semibold">
                                        {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Year: {vehicle.year}, License Plate: {vehicle.licensePlate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

