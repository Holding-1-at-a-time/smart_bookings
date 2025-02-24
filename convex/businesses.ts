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
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getOrganizationById } from "./organizations";

export const getBusinessInfo = query(async ({ db }, organizationId) => {
    // Fetch business information from your database based on businessId
    const business = await db.query("organizations")
        .withIndex("by_organization", (q) => q.eq("_id", Doc))
        .first();

    if (!business) {
        throw new Error(`Business with ID ${organizationId} not found.`);
    }

    return business;
});