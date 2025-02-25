/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:06:00
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
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { generateText } from "ai"


interface Service {
    id: string
    name: string
    basePrice: number
}

export function DynamicPricingCalculator() {
    const { organizationId } = useParams()
    const [selectedService, setSelectedService] = useState<string>("")
    const [demandFactor, setDemandFactor] = useState<number>(1)
    const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
    const [aiSuggestion, setAiSuggestion] = useState<string>("")

    const services = useQuery(api.services.getServices, { organizationId: organizationId as string })

    useEffect(() => {
        if (selectedService && services) {
            const service = services.find((s) => s.id === selectedService)
            if (service) {
                const newPrice = service.basePrice * demandFactor
                setCalculatedPrice(Number(newPrice.toFixed(2)))
                generateAISuggestion(service, newPrice)
            }
        }
    }, [selectedService, demandFactor, services])

    const generateAISuggestion = async (service: Service, newPrice: number) => {
        try {
            const { text } = await generateText({
                model: ollama("llama3.1: 8b"),
                prompt: `Given the service "${service.name}" with a base price of $${service.basePrice} and a calculated price of $${newPrice} based on current demand, provide a brief suggestion on whether this price is competitive and how it might affect customer demand. Consider factors like market trends and customer perception.`,
            })
            setAiSuggestion(text)
        } catch (error) {
            console.error("Error generating AI suggestion:", error)
            setAiSuggestion("Unable to generate AI suggestion at this time.")
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
                            {services?.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
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

