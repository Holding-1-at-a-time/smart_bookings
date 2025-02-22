/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 13:22:48
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useOrganization } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ErrorBoundary from "@/components/ErrorBoundery"
import CategoryForm from "@/components/services/CategoryForm"
import CategoryList from "@/components/services/CategoryList"
import ServiceForm from "@/components/services/ServiceForm"
import ServiceList from "@/components/services/ServiceList"
import { DialogHeader } from "@/components/ui/dialog"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"


export default function ServicesPage({ params }: { params: { organizationId: string } }) {
    const { organization } = useOrganization()
    const { toast } = useToast()
    const [showCreateServiceForm, setShowCreateServiceForm] = useState(false)
    const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"serviceCategories"> | undefined>()

    const deleteService = useMutation(api.services.deleteService)
    const categories = useQuery(api.services.listServiceCategories, {
        organizationId: params.organizationId as Id<"organizations">,
    })

    const organizationData = useQuery(api.organizations.getOrganizationData, {
        id: params.organizationId as Id<"organizations">,
    })
    if (!organizationData) {
        return <div>Loading organization data...</div>
    }

    const handleDeleteService = async (serviceId: Id<"services">) => {
        try {
            await deleteService({ id: serviceId })
            toast({
                title: "Service deleted",
                description: "The service has been deleted successfully.",
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to delete the service. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!organization) {
        return <div>Loading...</div>
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Services</h1>
                    <div className="space-x-2">
                        <Button onClick={() => setShowCreateCategoryForm(true)}>Add Category</Button>
                        <Button onClick={() => setShowCreateServiceForm(true)}>Add Service</Button>
                    </div>
                </div>

                <Dialog open={showCreateServiceForm} onOpenChange={setShowCreateServiceForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                        </DialogHeader>
                        <ServiceForm
                            organizationId={params.organizationId as Id<"organizations">}
                            categoryId={selectedCategoryId ?? undefined}
                            onSuccess={() => setShowCreateServiceForm(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showCreateCategoryForm} onOpenChange={setShowCreateCategoryForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            organizationId={params.organizationId as Id<"organizations">}
                            onSuccess={() => setShowCreateCategoryForm(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryList
                            organizationId={params.organizationId as Id<"organizations">}
                            onEdit={() => { }}
                            onSelectCategory={setSelectedCategoryId}
                        />
                    </CardContent>
                </Card>

                {categories?.map((category) => (
                    <Card key={category._id}>
                        <CardHeader>
                            <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ServiceList
                                organizationId={params.organizationId as Id<"organizations">}
                                categoryId={category._id}
                                onEdit={() => { }}
                                onDelete={handleDeleteService}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ErrorBoundary>
    )
}

