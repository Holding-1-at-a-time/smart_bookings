/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 00:04:32
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";


interface CategoryListProps {
  organizationId: Id<"organizations">;
  onEdit: (categoryId: Id<"serviceCategories">) => void;
}

/**
 * CategoryList component.
 *
 * This component renders a list of service categories for a given organization.
 * It displays the category name, description, and order.
 * Users can edit or delete categories, which will be reflected in the UI.
 *
 * @prop {Id<"organizations">} organizationId - The ID of the organization.
 * @prop {(categoryId: Id<"serviceCategories">) => void} onEdit - The function to call when a category is edited.
 *
 * @returns {JSX.Element} A JSX element representing the category list.
 */
export default function CategoryList({ organizationId, onEdit }: CategoryListProps) {
  /**
   * Get the list of service categories for the given organization.
   */
  const categories = useQuery(api.services.listServiceCategories, { organizationId });

  /**
   * Delete a service category.
   * @param {Id<"serviceCategories">} categoryId - The ID of the category to delete.
   */
  const deleteCategory = useMutation(api.services.deleteServiceCategory);

  /**
   * Handle the delete category button click.
   * @param {Id<"serviceCategories">} categoryId - The ID of the category to delete.
   */
  const handleDeleteCategory = async (categoryId: Id<"serviceCategories">) => {
    try {
      await deleteCategory({ id: categoryId });
      toast({
        title: "Category deleted",
        description: "The service category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Error",
        description: "Failed to delete the service category. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category._id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(category._id)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category._id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            <p className="text-sm mt-2">Order: {category.order}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

