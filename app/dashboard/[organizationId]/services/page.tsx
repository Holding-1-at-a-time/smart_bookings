/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 17:04:29
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Id } from "@/convex/_generated/dataModel"
import ServiceForm from "./components/ServiceForm"
import ServiceList from "./components/ServiceList"
import ErrorBoundary from "@/components/ErrorBoundery"
import { useToast } from "@/hooks/use-toast"

export default function ServicesPage({ params }: { params: { organizationId: string } }) {
    const { organization } = useOrganization()
    const { toast } = useToast()
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"serviceCategories"> | undefined>()

    const deleteService = useMutation(api.services.deleteService)
    const categories = useQuery(api.services.listServiceCategories, {
        organizationId: params.organizationId as Id<"organizations">,
    })

    const handleDeleteService = async (serviceId: Id<"services">) => {
        try {
            await deleteService({ id: serviceId })
            toast({
                title: "Service deleted",
                description: "The service has been deleted successfully.",
            })
        } catch (error) {
            console.error("Failed to delete service:", error);
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
                    <Button onClick={() => setShowCreateForm(true)}>Add Service</Button>
                </div>
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                        </DialogHeader>
                        <ServiceForm
                            organizationId={params.organizationId as Id<"organizations">}
                            categoryId={selectedCategoryId}
                            onSuccess={() => setShowCreateForm(false)}
                        />
                    </DialogContent>
                </Dialog>
                {(categories?.length ?? 0) > 0 ? (
                    categories?.map((category) => (
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
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-6">
                            No categories found. Please create a category first.
                        </CardContent>
                    </Card>
                )}
                {selectedCategoryId && (
                    <Button onClick={() => setSelectedCategoryId(undefined)}>Back to All Services</Button>
                )}
            </div>
            <div>
                {selectedCategoryId && (
                    <Card className="mt-6">
                        <CardContent className="py-6">
                            <ServiceList
                                organizationId={params.organizationId as Id<"organizations">}
                                categoryId={selectedCategoryId}
                                onEdit={() => { }}
                                onDelete={handleDeleteService}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </ErrorBoundary >
    );
}

