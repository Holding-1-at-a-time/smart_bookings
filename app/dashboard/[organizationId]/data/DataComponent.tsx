/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 21:15:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation } from "convex/react"
import { useState } from "react"


export default function DataComponent({ organizationId }: { organizationId: string }) {
    const { toast } = useToast()
    const data = useQuery(api.organizations.listOrganizationData, { organizationId, count: 10 })
    const addData = useMutation(api.organizations.upsertOrganizationData)
    const [newDataKey, setNewDataKey] = useState("")
    const [newDataValue, setNewDataValue] = useState("")

    const handleAddData = async () => {
        if (newDataKey.trim() && newDataValue.trim()) {
            try {
                await addData({
                    organizationId,
                    dataKey: newDataKey,
                    dataValue: newDataValue,
                })
                setNewDataKey("")
                setNewDataValue("")
                toast({
                    title: "Data added successfully",
                    description: `Key: ${newDataKey}, Value: ${newDataValue}`,
                })
            } catch (error) {
                toast({
                    title: "Error adding data",
                    description: (error as Error).message || "An unknown error occurred",
                    variant: "destructive",
                })
            }
        } else {
            toast({
                title: "Invalid input",
                description: "Both key and value must be non-empty",
                variant: "destructive",
            })
        }
    }

    if (data === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Organization Data</h2>
                {data.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No data available</p>
                ) : (
                    <ul className="space-y-2">
                        {data.map((item) => (
                            <li key={item._id} className="flex justify-between items-center">
                                <span className="font-medium">{item.data.key}:</span>
                                <span>{item.data.value}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="space-y-4">
                <Input
                    type="text"
                    value={newDataKey}
                    onChange={(e) => setNewDataKey(e.target.value)}
                    placeholder="Enter new data key"
                    className="w-full"
                />
                <Input
                    type="text"
                    value={newDataValue}
                    onChange={(e) => setNewDataValue(e.target.value)}
                    placeholder="Enter new data value"
                    className="w-full"
                />
                <Button onClick={handleAddData} className="w-full">
                    Add Data
                </Button>
            </div>
        </div>
    )
}

