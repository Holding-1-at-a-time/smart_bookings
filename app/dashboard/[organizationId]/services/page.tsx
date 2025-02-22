/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 03:45:03
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client";

import ErrorBoundary from "@/components/ErrorBoundery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import CategoryForm from "../../../../components/services/CategoryForm";
import CategoryList from "../../../../components/services/CategoryList";
import ServiceForm from "../../../../components/services/ServiceForm";
import ServiceList from "../../../../components/services/ServiceList";


interface Category {
    _id: Id<"serviceCategories">;
    _creationTime: number;
    description?: string;
    id: Id<"serviceCategories">;
    name: string;
    organizationId: Id<"organizations">;
    category: any[];
    order: number;
    isActive: boolean;
}
/**
 * ServicesPage component.
 *
 * This component renders the services page for the currently selected organization.
 * It displays a list of service categories and their associated services.
 * Users can add new categories and services, edit existing ones, and delete services.
 *
 * @prop {Object} params - The route parameters.
 * @prop {string} params.organizationId - The ID of the organization.
 *
 * @returns {JSX.Element} A JSX element representing the services page.
 */
export default function ServicesPage({ params }: { params: { organizationId: string } }) {
    const organization = useQuery(api.organizations.getOrganizationData, { id: params.organizationId as Id<"organizations"> })
    const { toast } = useToast()
    const [showCreateServiceForm, setShowCreateServiceForm] = useState(false)
    const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"serviceCategories"> | undefined>()

    const deleteService = useMutation(api.services.deleteService)
    /**
     * Get the list of service categories for the given organization.
     */
    const categories = useQuery(api.services.listServiceCategories, {
        organizationId: params.organizationId as Id<"organizations">,
    })

    /**
     * Handle the delete service button click.
     * @param {Id<"services">} serviceId - The ID of the service to delete.
     */
    const handleDeleteService = async (serviceId: Id<"services">) => {
        try {
            await deleteService({ id: serviceId })
            toast({
                title: "Service deleted",
                description: "The service has been deleted successfully.",
            })
        } catch (error) {
            console.error("Failed to delete service:", error)
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
                    <div className="flex gap-2">
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
                            categoryId={selectedCategoryId}
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
                        <CategoryList organizationId={params.organizationId as Id<"organizations">} onEdit={() => { }} />
                    </CardContent>
                </Card>

                {categories?.map((category: Category) => {
                    return (
                        <Card key={category._id} onClick={() => setSelectedCategoryId(category._id)}>
                            <CardHeader>
                                <CardTitle>{category.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedCategoryId === category._id && (
                                    <ServiceList
                                        organizationId={params.organizationId as Id<"organizations">}
                                        categoryId={category._id}
                                        onEditAction={() => { }}
                                        onDeleteAction={handleDeleteService} />
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </ErrorBoundary>
    )
}

