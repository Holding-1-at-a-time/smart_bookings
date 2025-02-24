/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:31:17
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface Tenant {
    id: string
    name: string
    email: string
    status: "active" | "inactive"
}

export default function TenantDashboard() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [newTenantName, setNewTenantName] = useState("")
    const [newTenantEmail, setNewTenantEmail] = useState("")

    const tenantsData = useQuery(api.tenants.getTenants)
    const createTenant = useMutation(api.tenants.createTenant)
    const updateTenantStatus = useMutation(api.tenants.updateTenantStatus)

    useEffect(() => {
        if (tenantsData) {
            setTenants(tenantsData)
        }
    }, [tenantsData])

    const handleCreateTenant = async () => {
        if (!newTenantName || !newTenantEmail) {
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                variant: "destructive",
            })
            return
        }

        try {
            await createTenant({
                name: newTenantName,
                email: newTenantEmail,
            })
            setNewTenantName("")
            setNewTenantEmail("")
            toast({
                title: "Success",
                description: "New tenant created successfully.",
            })
        } catch (error) {
            console.error("Error creating tenant:", error)
            toast({
                title: "Error",
                description: "Failed to create tenant. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleUpdateTenantStatus = async (tenantId: string, newStatus: "active" | "inactive") => {
        try {
            await updateTenantStatus({
                tenantId,
                status: newStatus,
            })
            toast({
                title: "Success",
                description: "Tenant status updated successfully.",
            })
        } catch (error) {
            console.error("Error updating tenant status:", error)
            toast({
                title: "Error",
                description: "Failed to update tenant status. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Create New Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="tenantName">Tenant Name</Label>
                            <Input
                                id="tenantName"
                                value={newTenantName}
                                onChange={(e) => setNewTenantName(e.target.value)}
                                placeholder="Enter tenant name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="tenantEmail">Tenant Email</Label>
                            <Input
                                id="tenantEmail"
                                type="email"
                                value={newTenantEmail}
                                onChange={(e) => setNewTenantEmail(e.target.value)}
                                placeholder="Enter tenant email"
                            />
                        </div>
                        <Button onClick={handleCreateTenant}>Create Tenant</Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tenants.map((tenant) => (
                            <div key={tenant.id} className="flex items-center justify-between p-4 border rounded">
                                <div>
                                    <h3 className="font-semibold">{tenant.name}</h3>
                                    <p className="text-sm text-gray-500">{tenant.email}</p>
                                </div>
                                <div>
                                    <Button
                                        variant={tenant.status === "active" ? "destructive" : "default"}
                                        onClick={() =>
                                            handleUpdateTenantStatus(tenant.id, tenant.status === "active" ? "inactive" : "active")
                                        }
                                    >
                                        {tenant.status === "active" ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

