/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 02:01:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "convex/values";

export const getBusinessInfo = query(async ({ db }, organizationId: Id<"organizations">) => {
    const business = await db.query("organizations")
        .withIndex("by_id", (q) => q.eq("_id", organizationId))
        .first();

    if (!business) {
        throw new Error(`Business with _Id ${organizationId} not found.`);
    }

    return business;
});

export const updateBusinessInfo = mutation({
    args: {
        organizationId: v.id("organizations"),
        businessName: v.string(),
        address: v.string(),
        phone: v.string(),
        email: v.string(),
    },
    async handler({ db }, args) {
        const { organizationId, businessName, address, phone, email } = args;
        // Update business information in your database based on organizationId
        await db.patch(organizationId, { name: businessName, address: address, phone: phone, email: email });
    },
});
/**
 * Deletes a business by its organization ID.
 *
 * @param db - The database context for executing queries.
 * @param args - An object containing:
 *   - organizationId: The ID of the organization to delete.
 * @returns A promise that resolves to void.
 */
export const deleteBusiness = mutation({
    args: { organizationId: v.id("organizations") },
    handler: async (convexToJson, args) => {
        const { organizationId } = args;
        // Delete business information from your database based on organizationId   
        await convexToJson.db.delete(organizationId);
        return { success: true };
    }
});
/**
 * Adds a business to the database.
 *
 * @param db - The database context for executing queries.
 * @param args - An object containing:
 *   - organizationId: The ID of the organization to add.
 *   - businessName: The name of the business.
 *   - address: The address of the business.
 *   - phone: The phone number of the business.
 *   - email: The email address of the business.
 * @returns A promise that resolves to void.
 */
export const addBusiness = mutation({
    args: {
        organizationId: v.id("organizations"),
        businessName: v.string(),
        address: v.string(),
        phone: v.string(),
        email: v.string(),
    },
    async handler(
        { db }: { db: Db },
        { organizationId, businessName, address, phone, email }: {
            organizationId: string;
            businessName: string;
            address: string;
            phone: string;
            email: string;
        }
    ): Promise<void> {
        // Insert business information into your database based on organizationId
        await db.insert("organizations", {
            _id: organizationId,
            businessName,
            address,
            phone,
            email,
        });
    },
});

