/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 02:45:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"

interface CategoryFormProps {
    organizationId: Id<"organizations">
    onSuccess?: () => void
}

export default function CategoryForm({ organizationId, onSuccess }: CategoryFormProps) {
    const { toast } = useToast()
    const createCategory = useMutation(api.services.createServiceCategory)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        order: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createCategory({
                organizationId,
                name: formData.name,
                description: formData.description,
                order: Number.parseInt(formData.order),
            })

            toast({
                title: "Category created",
                description: "The service category has been created successfully.",
            })

            setFormData({ name: "", description: "", order: "" })
            onSuccess?.()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create the service category. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    placeholder="Category Name"
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
                />
            </div>
            <div>
                <Input
                    type="number"
                    placeholder="Order"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    required
                />
            </div>
            <Button type="submit">Create Category</Button>
        </form>
    )
}

