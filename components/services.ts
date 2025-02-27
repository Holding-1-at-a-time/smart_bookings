/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 16:56:17
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/



export const serviceList = query({
    args: {
        organizationId: v.id("organizations"),
        categoryId: v.optional(v.id("serviceCategories")),
        serviceListId: v.id("serviceLists"),
        serviceId: v.id("services"),
        serviceStatus: v.optional(v.enum(["active", "inactive"])),
        serviceType: v.optional(v.enum(["free", "paid"])),
        serviceName: v.optional(v.string()),
        serviceDescription: v.optional(v.string()),
        duration
    },

    handler: async (ctx, { organizationId, categoryId }) => {
        return await ctx.db
            .query("services")
            .filter((s) => s.organizationId === organizationId)
            .filter((s) => s.categoryId === categoryId)
            .collect()
    },
})