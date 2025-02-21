/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 03:08:53
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

type ServiceListProps = {
    organizationId: Id<"organizations">;
    categoryId: Id<"serviceCategories">;
    onEditAction: (serviceId: Id<"services">) => void;
    onDeleteAction: (serviceId: Id<"services">) => void;
};


/**
 * ServiceList component.
 *
 * This component renders a list of services for a given organization and category.
 * It displays the service name, description, duration, price, and features.
 * Users can edit or delete services, which will be reflected in the UI.
 *
 * @prop {Id<"organizations">} organizationId - The ID of the organization.
 * @prop {Id<"serviceCategories">} categoryId - The ID of the service category.
 * @prop {(serviceId: Id<"services">) => void} onEditAction - The function to call when a service is edited.
 * @prop {(serviceId: Id<"services">) => void} onDeleteAction - The function to call when a service is deleted.
 *
 * @returns {JSX.Element} A JSX element representing the service list.
 */
export default function ServiceList({
    organizationId,
    categoryId,
    onEditAction,
    onDeleteAction,
}: ServiceListProps) {
    const services = useQuery(api.services.listServices, {
        organizationId,
        categoryId,
    });

    if (!services) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <Card key={service._id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEditAction(service._id)}
                                className="h-8 w-8"
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteAction(service._id)}
                                className="h-8 w-8 text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex justify-between text-sm">
                            <span>{service.duration} minutes</span>
                            <span className="font-medium">${service.price.toFixed(2)}</span>
                        </div>
                        {service.features.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Features:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    {service.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
