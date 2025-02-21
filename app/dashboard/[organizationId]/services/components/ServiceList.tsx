/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 19:08:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { JSX } from "react";
import { Button } from "react-day-picker";
import { Id } from "@/convex/_generated/dataModel";


/**
 * ServiceList component.
 *
 * This component renders a list of services for a given organization and category.
 * Each service is displayed as a card with its name, description, duration, price, and features.
 * The component also provides buttons to edit and delete each service.
 *
 * @param {ServiceListProps} p`rops - The props for the component.
 * @param {Id<"organizations">} props.organizationId - The ID of the organization.
 * @param {Id<"serviceCategories">} props.categoryId - The ID of the service category.
 * @param {(serviceId: Id<"services">) => void} props.onEdit - The function to call when editing a service.
 * @param {(serviceId: Id<"services">) => void} props.onDelete - The function to call when deleting a service.
 * @returns {JSX.Element} A JSX element representing the component.
 */

interface ServiceListProps {
  organizationId: Id<"organizations">;
  categoryId: Id<"serviceCategories">;
  onEdit: (serviceId: Id<"services">) => void;
  onDelete: (serviceId: Id<"services">) => void;
}

export default function ServiceList({
  organizationId,
  categoryId,
  onEdit,
  onDelete,
}: ServiceListProps): JSX.Element {
  const services = useQuery(api.services.listServices, {
    organizationId,
    categoryId,
  });

  if (!services) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service: Service) => (
        <Card key={service._id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(service._id)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(service._id)} className="h-8 w-8 text-destructive">
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
                  {service.features.map((feature: string, index: number) => (
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