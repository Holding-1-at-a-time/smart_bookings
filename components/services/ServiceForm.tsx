/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 03:38:12
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * ServiceForm component.
 *
 * This component provides a form to create a new service for a given organization and category.
 * It includes fields for service name, description, duration, price, features, maximum bookings per day,
 * preparation time, and cleanup time.
 *
 * @param {Id<"organizations">} organizationId - The ID of the organization.
 * @param {Id<"serviceCategories">} [categoryId] - The optional ID of the service category.
 * @param {Function} [onSuccess] - The optional callback function to call upon successful service creation.
 *
 * @returns {JSX.Element} A JSX element representing the service form.
 */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface ServiceFormProps {
    organizationId: Id<"organizations">
    categoryId?: Id<"serviceCategories">
    onSuccess?: () => void
}

export default function ServiceForm({ organizationId, categoryId, onSuccess }: ServiceFormProps) {
    const { toast } = useToast()
    const createService = useMutation(api.services.createService)

    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: "",
        price: "",
        features: [""],
        maxBookingsPerDay: "",
        preparationTime: "",
        cleanupTime: "",
    })

    /**
     * Handle form submission.
     * 
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createService({
                organizationId,
                categoryId,
                name: formData.name,
                description: formData.description,
                duration: Number.parseInt(formData.duration),
                price: Number.parseFloat(formData.price),
                features: formData.features.filter(Boolean),
                maxBookingsPerDay: formData.maxBookingsPerDay ? Number.parseInt(formData.maxBookingsPerDay) : undefined,
                preparationTime: formData.preparationTime ? Number.parseInt(formData.preparationTime) : undefined,
                cleanupTime: formData.cleanupTime ? Number.parseInt(formData.cleanupTime) : undefined,
            })

            toast({
                title: "Service created",
                description: "The service has been created successfully.",
            })

            setFormData({
                name: "",
                description: "",
                duration: "",
                price: "",
                features: [""],
                maxBookingsPerDay: "",
                preparationTime: "",
                cleanupTime: "",
            })

            onSuccess?.()
        } catch (error) {
            console.error("Failed to create service:", error)
            toast({
                title: "Error",
                description: "Failed to create the service. Please try again.",
                variant: "destructive",
            })
        }
    }

    /**
     * Handle changes to the features input fields.
     * 
     * @param {number} index - The index of the feature in the features array.
     * @param {string} value - The new value for the feature.
     */
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        if (index === formData.features.length - 1 && value) {
            newFeatures.push("")
        }
        setFormData({ ...formData, features: newFeatures })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    placeholder="Service Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <Textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                />
                <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Features</h3>
                {formData.features.map((feature, index) => (
                    <Input
                        key={index}
                        placeholder="Add a feature"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Input
                    type="number"
                    placeholder="Max Bookings/Day"
                    value={formData.maxBookingsPerDay}
                    onChange={(e) => setFormData({ ...formData, maxBookingsPerDay: e.target.value })}
                />
                <Input
                    type="number"
                    placeholder="Prep Time (min)"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                />
                <Input
                    type="number"
                    placeholder="Cleanup Time (min)"
                    value={formData.cleanupTime}
                    onChange={(e) => setFormData({ ...formData, cleanupTime: e.target.value })}
                />
            </div>
            <Button type="submit">Create Service</Button>
        </form>
    )
}

