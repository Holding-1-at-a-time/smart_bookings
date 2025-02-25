/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:31:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function TenantOnboarding() {
    const [tenantName, setTenantName] = useState("")
    const [tenantEmail, setTenantEmail] = useState("")
    const [businessName, setBusinessName] = useState("")
    const [businessAddress, setBusinessAddress] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [businessDescription, setBusinessDescription] = useState("")

    const createTenant = useMutation(api.tenants.createTenant)
    const setupBusiness = useMutation(api.businesses.setupBusiness)

    const handleOnboarding = async () => {
        if (!tenantName || !tenantEmail || !businessName || !businessAddress || !businessPhone) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        try {
            const tenant = await createTenant({
                name: tenantName,
                email: tenantEmail,
            })

            await setupBusiness({
                tenantId: tenant.id,
                name: businessName,
                address: businessAddress,
                phone: businessPhone,
                description: businessDescription,
            })

            toast({
                title: "Success",
                description: "Tenant onboarded successfully.",
            })

            // Reset form
            setTenantName("")
            setTenantEmail("")
            setBusinessName("")
            setBusinessAddress("")
            setBusinessPhone("")
            setBusinessDescription("")
        } catch (error) {
            console.error("Error onboarding tenant:", error)
            toast({
                title: "Error",
                description: "Failed to onboard tenant. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Tenant Onboarding</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Onboard New Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="tenantName">Tenant Name</Label>
                            <Input
                                id="tenantName"
                                value={tenantName}
                                onChange={(e) => setTenantName(e.target.value)}
                                placeholder="Enter tenant name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tenantEmail">Tenant Email</Label>
                            <Input
                                id="tenantEmail"
                                type="email"
                                value={tenantEmail}
                                onChange={(e) => setTenantEmail(e.target.value)}
                                placeholder="Enter tenant email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                                id="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Enter business name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="businessAddress">Business Address</Label>
                            <Input
                                id="businessAddress"
                                value={businessAddress}
                                onChange={(e) => setBusinessAddress(e.target.value)}
                                placeholder="Enter business address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="businessPhone">Business Phone</Label>
                            <Input
                                id="businessPhone"
                                value={businessPhone}
                                onChange={(e) => setBusinessPhone(e.target.value)}
                                placeholder="Enter business phone"
                            />
                        </div>
                        <div>
                            <Label htmlFor="businessDescription">Business Description</Label>
                            <Textarea
                                id="businessDescription"
                                value={businessDescription}
                                onChange={(e) => setBusinessDescription(e.target.value)}
                                placeholder="Enter business description"
                            />
                        </div>
                        <Button onClick={handleOnboarding}>Complete Onboarding</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

