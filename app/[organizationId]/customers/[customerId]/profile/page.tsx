/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:34:50
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
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface CustomerProfile {
    id: string
    name: string
    email: string
    phone: string
    address: string
}

export default function CustomerProfile() {
    const { organizationId, customerId } = useParams()
    const [profile, setProfile] = useState<CustomerProfile | null>(null)

    const customerProfile = useQuery(api.customers.getCustomerProfile, {
        organizationId: organizationId as string,
        customerId: customerId as string,
    })
    const updateCustomerProfile = useMutation(api.customers.updateCustomerProfile)

    useEffect(() => {
        if (customerProfile) {
            setProfile(customerProfile)
        }
    }, [customerProfile])

    const handleUpdateProfile = async () => {
        if (!profile) return

        try {
            await updateCustomerProfile({
                organizationId: organizationId as string,
                customerId: customerId as string,
                ...profile,
            })
            toast({
                title: "Success",
                description: "Customer profile updated successfully.",
            })
        } catch (error) {
            console.error("Error updating customer profile:", error)
            toast({
                title: "Error",
                description: "Failed to update customer profile. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!profile) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Customer Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleUpdateProfile}>Update Profile</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

