/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 21:17:00
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { useToast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CategoryFormProps {
    organizationId: Id<"organizations">
    onSuccess?: () => void
}

export default function CategoryForm({ organizationId, onSuccess }: CategoryFormProps) {
    const { toast } = useToast()
    const [name, setName] = useState("")
    const createCategory = useMutation(api.services.createServiceCategory)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createCategory({
                organizationId,
                name,
                description: "",
                order: 0,
                isActive: true,
            })
            toast({
                title: "Success",
                description: "Category created successfully",
            })
            setName("")
            onSuccess?.()
        } catch (error) {
            console.error("Failed to create category:", error);
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Button type="submit">Create Category</Button>
        </form>
    )
}

