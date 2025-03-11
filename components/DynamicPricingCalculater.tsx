/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 25/02/2025 - 05:06:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { useCompletion } from "ai/react"
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { ollama } from "ollama-ai-provider";

interface Service {
    _id: Id<"services">;
    _creationTime: number;
    categoryId?: Id<"serviceCategories"> | undefined;
    images?: string[] | undefined;
    maxBookingsPerDay?: number | undefined;
    preparationTime?: number | undefined;
    name: string;
    description?: string | undefined;
    basePrice: number;
    features: string[];
}

export function DynamicPricingCalculator() {
    const { organizationId } = useParams()
    const [selectedService, setSelectedService] = useState<string>("")
    const [demandFactor, setDemandFactor] = useState<number>(1)
    const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
    const [aiSuggestion, setAiSuggestion] = useState<string>("")

    const services = useQuery(api.services.listServices, { Id: organizationId as string })
    const analyzeServicePopularity = useMutation(api.analytics.analyzeServicePopularity)
    const forecastDemand = useMutation(api.analytics.forecastDemand)

    const { complete } = useCompletion({
        api: "/api/ai/pricing-suggestion",
    })

    useEffect(() => {
        if (selectedService) {
            calculatePrice()
        }
    }, [selectedService])

    const calculatePrice = async () => {
        if (!selectedService) {
            return
        }

        try {
            const service = services?.find((s) => s._id === selectedService)
            if (!service) {
                return
            }

            const popularity = await analyzeServicePopularity({
                organizationId: organizationId as string,
                serviceId: selectedService,
            })

            const demand = await forecastDemand({
                organizationId: organizationId as string,
                serviceId: selectedService,
            })

            const newPrice = service.basePrice * demandFactor * (1 + popularity) * (1 + demand)
            setCalculatedPrice(Number(newPrice.toFixed(2)))

            const aiResponse =
                await complete(`Given the service "${service.name}" with a base price of $${service.basePrice}, 
        a calculated price of $${newPrice.toFixed(2)} based on current demand factor of ${demandFactor}, 
        popularity score of ${popularity}, and forecasted demand of ${demand}, 
        provide a brief suggestion on whether this price is competitive and how it might affect customer demand. 
        Consider factors like market trends and customer perception.`)

            setAiSuggestion(aiResponse || "")
        } catch (error) {
            console.error("Error calculating price:", error)
            toast({
                title: "Error",
                description: "Failed to calculate price. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dynamic Pricing Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="service">Select Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a service" />
                        </SelectTrigger>
                        <SelectContent>
                            {services?.map((service: Service) => (
                                <SelectItem key={service._id} value={service._id}>
                                    {service.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="demandFactor">Demand Factor</Label>
                    <Slider
                        id="demandFactor"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={[demandFactor]}
                        onValueChange={(value) => setDemandFactor(value[0])}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Current factor: {demandFactor.toFixed(1)}x</p>
                </div>
                {calculatedPrice !== null && (
                    <div>
                        <h3 className="text-lg font-semibold">Calculated Price</h3>
                        <p className="text-2xl font-bold">${calculatedPrice}</p>
                    </div>
                )}
                {aiSuggestion && (
                    <div>
                        <h3 className="text-lg font-semibold">AI Suggestion</h3>
                        <p className="text-sm">{aiSuggestion}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}