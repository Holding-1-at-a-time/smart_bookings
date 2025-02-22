/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 14:44:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { useAction, useQuery } from "convex/react"
import { useState } from "react"
import { Button } from "react-day-picker"


export default function RLManagementPage({ params }: { params: { organizationId: string } }) {
    const { toast } = useToast()
    const organizationId = params.organizationId as Id<"organizations">
    const trainRLModel = useAction(api.reinforcementLearning.trainRLModel)
    const rlModel = useQuery(api.reinforcementLearning.getRLModel, { organizationId })
    const [isTraining, setIsTraining] = useState(false)

    const handleTrainModel = async () => {
        setIsTraining(true)
        try {
            await trainRLModel({ organizationId })
            toast({
                title: "Model trained",
                description: "The reinforcement learning model has been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to train the model. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsTraining(false)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reinforcement Learning Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Current RL Model</CardTitle>
                </CardHeader>
                <CardContent>
                    {rlModel ? (
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(rlModel, null, 2)}</pre>
                    ) : (
                        <p>No RL model found for this organization.</p>
                    )}
                </CardContent>
            </Card>
            <Button onClick={handleTrainModel} disabled={isTraining}>
                {isTraining ? "Training..." : "Train RL Model"}
            </Button>
        </div>
    )
}

