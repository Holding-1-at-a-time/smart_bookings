/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 03:44:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// convex/pricingRequests.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// convex/pricingRequests.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitPricingRequest = mutation({
    args: {
        tier: v.string(),
        price: v.string(),
        businessName: v.string(),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        locations: v.string(),
        employees: v.string(),
        currentSoftware: v.string(),
        monthlyBookings: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("pricingRequests", {
                    ...args,
                    createdAt: new Date().toISOString(),
                });
    },
});