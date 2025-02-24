/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:02:23
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import {
    CreateOrganization,
    OrganizationProfile,
    useOrganization,
    useOrganizationList,
    OrganizationList,
} from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export default function OrgManagementPage() {
    const [activeTab, setActiveTab] = useState("switch")
    const { organization } = useOrganization()
    const { setActive } = useOrganizationList()

    const handleOrganizationChange = async (orgId: string) => {
        try {
            await setActive({ organization: orgId })
            toast({
                title: "Organization Changed",
                description: "You have successfully switched organizations.",
            })
        } catch (error) {
            console.error("Error changing organization:", error)
            toast({
                title: "Error",
                description: "Failed to switch organizations. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="switch">Switch Organization</TabsTrigger>
                    <TabsTrigger value="create">Create Organization</TabsTrigger>
                    {organization && <TabsTrigger value="profile">Organization Profile</TabsTrigger>}
                </TabsList>
                <TabsContent value="switch">
                    <Card>
                        <CardHeader>
                            <CardTitle>Switch Organization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrganizationList
                                hidePersonal
                                appearance={{
                                    elements: {
                                        organizationSwitcherTrigger: "bg-[#00AE98] text-white",
                                    },
                                }}
                                onOrganizationClick={(org) => handleOrganizationChange(org.id)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Organization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateOrganization
                                appearance={{
                                    elements: {
                                        formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                {organization && (
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OrganizationProfile
                                    appearance={{
                                        elements: {
                                            formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

