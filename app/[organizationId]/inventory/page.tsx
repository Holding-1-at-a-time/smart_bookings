/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:26:18
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

interface InventoryItem {
    id: string
    name: string
    quantity: number
    unit: string
    reorderPoint: number
}

export default function InventoryPage() {
    const { organizationId } = useParams()
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "", reorderPoint: "" })

    const inventoryData = useQuery(api.inventory.listItems, { organizationId: organizationId as string })
    const addInventoryItem = useMutation(api.inventory.addItem)

    useEffect(() => {
        if (inventoryData) {
            setInventoryItems(inventoryData)
        }
    }, [inventoryData])

    const handleAddItem = async () => {
        try {
            await addInventoryItem({
                organizationId: organizationId as string,
                ...newItem,
                quantity: Number.parseInt(newItem.quantity),
                reorderPoint: Number.parseInt(newItem.reorderPoint),
            })
            setNewItem({ name: "", quantity: "", unit: "", reorderPoint: "" })
            toast({
                title: "Item added",
                description: "New inventory item has been successfully added.",
            })
        } catch (error) {
            console.error("Error adding inventory item:", error)
            toast({
                title: "Error",
                description: "Failed to add new inventory item. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Inventory Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Item Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <Input
                            placeholder="Quantity"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        />
                        <Input
                            placeholder="Unit"
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        />
                        <Input
                            placeholder="Reorder Point"
                            value={newItem.reorderPoint}
                            onChange={(e) => setNewItem({ ...newItem, reorderPoint: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAddItem} className="mt-4">
                        Add Item
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Inventory List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {inventoryItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4 border rounded">
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity} {item.unit}, Reorder Point: {item.reorderPoint}
                                    </p>
                                </div>
                                {item.quantity <= item.reorderPoint && <span className="text-red-500 font-semibold">Low Stock</span>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

