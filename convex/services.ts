/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:21:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"
import { Id } from "./_generated/dataModel";
import { getOrganizationById } from "./organizations";
interface DeleteServiceArgs {
    organizationId: Id<"organizations">;
    serviceId: Id<"services">;
}

interface DeleteServiceResult {
    success: boolean;
}

export const deleteService = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
    },
    handler: async (ctx: any, args: DeleteServiceArgs): Promise<DeleteServiceResult> => {
        const { serviceId, organizationId } = args;

        try {
            const service = await ctx.db.get(serviceId, "services");
            if (!service || service.organizationId !== organizationId) {
                throw new Error("Service not found or access denied");
            }

            const services = await ctx.db.query("services", (q: any) =>
                q.eq("organizationId", organizationId).eq("name", service.name)
            );
            if (services.length > 1) {
                throw new Error("There is already another service with the same name for the organization");
            }
            await ctx.db.delete(serviceId);
            loggingService.info(`Service deleted: ${serviceId}`, { organizationId });
            return { success: true };
        } catch (error) {
            loggingService.error(`Error deleting service: ${error}`, { organizationId, serviceId });
            throw new Error("Failed to delete service");
        }
    },
});

export const createService = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, description, price, duration } = args

        try {
            const insertedService = await ctx.db.insert("services", {
                organizationId,
                name,
                description,
                basePrice: price,
                duration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
                features: []
            })

            loggingService.info(`Service created: ${insertedService} `, { organizationId, name })
            return { success: true, serviceId: insertedService }
        } catch (error) {
            loggingService.error(`Error creating service: ${error} `, { organizationId, name })
            throw new Error("Failed to create service")
        }
    },
})


export const updateService = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, ...updates } = args

        try {
            const service = await ctx.db.get(serviceId)
            if (!service || service.organizationId !== organizationId) {
                throw new Error("Service not found or access denied")
            }

            const updatedFields = {
                ...updates,
                updatedAt: new Date().toISOString(),
            }

            await ctx.db.patch(serviceId, updatedFields)

            loggingService.info(`Service updated: ${serviceId} `, { organizationId, updates })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating service: ${error} `, { organizationId, serviceId })
            throw new Error("Failed to update service")
        }
    },
})

export const listServices = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const services = await ctx.db
                .query("services")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Services listed for organization: ${organizationId} `)
            return services
        } catch (error) {
            loggingService.error(`Error listing services: ${error} `, { organizationId })
            throw new Error("Failed to list services")
        }
    },
})

/**
 * Adds a new service to the database.
 *
 * @param ctx - The context object for the mutation.
 * @param args - An object containing the service details.
 * @param args.organizationId - The ID of the organization.
 * @param args.categoryId - The optional ID of the service category.
 * @param args.name - The name of the service.
 * @param args.description - The description of the service.
 * @param args.duration - The duration of the service in minutes.
 * @param args.basePrice - The base price of the service.
 * @param args.isActive - Indicates if the service is active.
 * @param args.features - An array of features for the service.
 * @param args.images - An optional array of image URLs for the service.
 * @param args.maxBookingsPerDay - The optional maximum number of bookings per day.
 * @param args.preparationTime - The optional preparation time in minutes.
 * @param args.cleanupTime - The optional cleanup time in minutes.
 * @param args.createdAt - The creation date of the service.
 * @param args.updatedAt - The last update date of the service.
 *
 * @returns An object indicating the success of the operation and the ID of the newly added service.
 */
export const addService = mutation({
    args: {
        organizationId: v.id("organizations"),
        categoryId: v.optional(v.id("serviceCategories")),
        name: v.string(),
        description: v.string(),
        duration: v.number(),
        basePrice: v.number(),
        isActive: v.boolean(),
        features: v.array(v.string()),
        images: v.optional(v.array(v.string())),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
        createdAt: v.string(),
        updatedAt: v.string(),
    },
    handler: async (
        ctx: {
            db: {
                query: Function;
                insert: Function;
            };
        },
        args: {
            organizationId: string;
            categoryId?: string;
            name: string;
            description: string;
            duration: number;
            basePrice: number;
            isActive: boolean;
            features: string[];
            images?: string[];
            maxBookingsPerDay?: number;
            preparationTime?: number;
            cleanupTime?: number;
            createdAt: string;
            updatedAt: string;
        }
    ): Promise<{ success: boolean; serviceId: string }> => {
        const { organizationId, name, description, basePrice, duration, categoryId, features, images, maxBookingsPerDay, preparationTime, cleanupTime, createdAt, updatedAt } = args;
        try {
            const existingService = await ctx.db
                .query("services")
                .withIndex("by_organization", (q: any) => q.eq("organizationId", organizationId))
                .filter((q: any) => q.eq("name", name))
                .first();

            if (existingService) {
                throw new Error(`A service with the name '${name}' already exists for organization: ${organizationId} `);
            }

            const service = await ctx.db.insert("services", {
                organizationId,
                name,
                description,
                basePrice,
                duration,
                categoryId,
                features,
                images,
                maxBookingsPerDay,
                preparationTime,
                cleanupTime,
                createdAt,
                updatedAt,
            });

            loggingService.info(`Service added: ${service._id} `, { organizationId });
            return { success: true, serviceId: service._id };
        } catch (error) {
            loggingService.error(`Error adding service: ${error} `, { organizationId });
            throw new Error("Failed to add service");
        }
    },
});

/**
 * Retrieve a list of services for an organization.
 *
 * @param ctx - The Convex context object.
 * @param args - An object containing the organization ID and optional filter criteria.
 * @param args.organizationId - The ID of the organization.
 * @param args.serviceCategoryId - The optional ID of the service category.
 * @param args.categoryId - The optional ID of the service category.
 * @param args.name - The optional name of the service.
 * @param args.description - The optional description of the service.
 * @param args.duration - The optional duration of the service in minutes.
 * @param args.basePrice - The optional base price of the service.
 * @param args.isActive - The optional boolean indicating if the service is active.
 * @param args.features - The optional array of features for the service.
 * @param args.images - The optional array of image URLs for the service.
 * @param args.maxBookingsPerDay - The optional maximum number of bookings per day.
 * @param args.preparationTime - The optional preparation time in minutes.
 * @param args.cleanupTime - The optional cleanup time in minutes.
 * @param args.createdAt - The optional creation date of the service.
 * @param args.updatedAt - The optional last update date of the service.
 *
 * @returns A list of services that match the filter criteria.
 */
export const getServices = query({
    args: {
        organizationId: v.id("organizations"),
        serviceCategoryId: v.optional(v.id("serviceCategories")),
        categoryId: v.optional(v.id("serviceCategories")),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        basePrice: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
        features: v.optional(v.array(v.string())),
        images: v.optional(v.array(v.string())),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
        createdAt: v.optional(v.string()),
        updatedAt: v.optional(v.string()),
    },

    
/**
     * Retrieves a list of services for a specific organization based on optional filtering criteria.
     * 
     * @param ctx - The context object containing authentication and database access.
     * @param args - An object containing optional parameters to filter the services.
     * @returns A promise that resolves to an array of service documents.
     * @throws Error if the user is unauthenticated or if the organization ID does not match.
     */
    handler: async (ctx: any, args: {
        organizationId: Id<"organizations">;
        serviceCategoryId?: Id<"serviceCategories">;
        categoryId?: Id<"serviceCategories">;
        name?: string;
        description?: string;
        duration?: number;
        basePrice?: number;
        isActive?: boolean;
        features?: string[];
        images?: string[];
        maxBookingsPerDay?: number;
        preparationTime?: number;
        cleanupTime?: number;
        createdAt?: string;
        updatedAt?: string;
    }): Promise<ConvexDocument<"services">[]> => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Unauthenticated call to mutation");
        }
        const { tokenIdentifier, name, email } = identity!
        const organizationId = await getOrganizationById(ctx, identity.tokenIdentifier);

        const { organizationId: orgId } = args;
        if (orgId !== organizationId) {
            throw new Error("Organization mismatch. User does not belong to this organization.");
        }

        try {
            const services = await ctx.db.query("services")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .filter((q) => {
                    if (args.serviceCategoryId) {
                        q = q.eq("serviceCategoryId", args.serviceCategoryId);
                    }
                    if (args.categoryId) {
                        q = q.eq("categoryId", args.categoryId);
                    }
                    if (args.name) {
                        q = q.eq("name", args.name);
                    }
                    if (args.description) {
                        q = q.eq("description", args.description);
                    }
                    if (args.duration) {
                        q = q.eq("duration", args.duration);
                    }
                    if (args.basePrice) {
                        q = q.eq("basePrice", args.basePrice);
                    }
                    if (args.isActive) {
                        q = q.eq("isActive", args.isActive);
                    }
                    if (args.features) {
                        q = q.in("features", args.features);
                    }
                    if (args.images) {
                        q = q.in("images", args.images);
                    }
                    if (args.maxBookingsPerDay) {
                        q = q.eq("maxBookingsPerDay", args.maxBookingsPerDay);
                    }
                    if (args.preparationTime) {
                        q = q.eq("preparationTime", args.preparationTime);
                    }
                    if (args.cleanupTime) {
                        q = q.eq("cleanupTime", args.cleanupTime);
                    }
                    if (args.createdAt) {
                        q = q.eq("createdAt", args.createdAt);
                    }
                    if (args.updatedAt) {
                        q = q.eq("updatedAt", args.updatedAt);
                    }
                    return q;
                })
                .collect();
            loggingService.info(`Services retrieved for organization: ${organizationId}`);
            return services;
        } catch (error) {
            loggingService.error(`Error retrieving services: ${error}`, { organizationId });
            throw new Error("Failed to retrieve services");
        }
    },
})
