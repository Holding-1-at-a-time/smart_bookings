/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:33:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function BusinessSetup() {
    const { organizationId } = useParams()
    const [businessName, setBusinessName] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    const updateBusinessInfo = useMutation(api.businesses.updateBusinessInfo)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateBusinessInfo({
                organizationId: organizationId as string,
                businessName,
                description,
                address,
                phone,
            })
            toast({
                title: "Business information updated",
                description: "Your business details have been successfully saved.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update business information. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <Button type="submit">Save Business Information</Button>
        </form>
    )
}

