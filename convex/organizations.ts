/**
 * @description      : This file contains the Convex schema for the organizations table, as
 *                    well as mutations and queries for interacting with that table.
 * @author           : rrome
 * @group            : 
 * @created          : 19/02/2025 - 16:18:34
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 19/02/2025
 * - Author          : rrome
 * - Modification    : 
 */

import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";


// Internal mutation for ACID-compliant data operations
const internalUpsertOrganizationData = internalMutation({
    /**
     * @description  : Upsert organization data with the given key and value.
     *                If the key already exists, update the value.
     *                If the key does not exist, create a new entry.
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - dataKey: The key of the data to upsert
     *                - dataValue: The value of the data to upsert
     *                - analyticsKey: The key of the analytics data to upsert
     *                - analyticsValue: The value of the analytics data to upsert
     */
    args: {
        organizationId: v.id("organizations"),
        dataKey: v.string(),
        dataValue: v.string(),
        analyticsKey: v.optional(v.string()),
        analyticsValue: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingData = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .filter((q) => q.eq(q.field("data.key"), args.dataKey))
            .first();

        if (existingData) {
            await ctx.db.patch(existingData._id, {
                data: { key: args.dataKey, value: args.dataValue },
                ...(args.analyticsKey && args.analyticsValue
                    ? { analytics: { key: args.analyticsKey, value: args.analyticsValue } }
                    : {}),
            });
        } else {
            await ctx.db.insert("organizationData", {
                organizationId: args.organizationId,
                data: { key: args.dataKey, value: args.dataValue },
                analytics: args.analyticsKey && args.analyticsValue
                    ? { key: args.analyticsKey, value: args.analyticsValue }
                    : { key: '', value: '' },
                createdAt: new Date().toISOString(),
            }
            );
        }
    },
});

// Public mutation for adding or updating organization data
export const upsertOrganizationData = mutation({
    /**
     * @description  : Public mutation for adding or updating organization data.
     *                This mutation simply calls the internal mutation.
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - dataKey: The key of the data to upsert
     *                - dataValue: The value of the data to upsert
     *                - analyticsKey: The key of the analytics data to upsert
     *                - analyticsValue: The value of the analytics data to upsert
     */
    args: {
        organizationId: v.id("organizations"),
        dataKey: v.string(),
        dataValue: v.string(),
        analyticsKey: v.optional(v.string()),
        analyticsValue: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.runMutation(internalUpsertOrganizationData, args);
    },
});

// Query to list organization data
export const listOrganizationData = query({
    /**
     * @description  : Query to list organization data.
     *                This query returns a list of objects with the following properties:
     *                - key: The key of the data
     *                - value: The value of the data
     *                - analytics: The analytics data associated with the data
     *                - createdAt: The timestamp of when the data was created
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - count: The number of data points to return
     */
    args: { organizationId: v.id("organizations"), count: v.number() },
    handler: async (ctx, args) => {
        const data = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .order("desc")
            .take(args.count);

        return data.map((item) => ({
            key: item.data.key,
            value: item.data.value,
            analytics: item.analytics,
            createdAt: item.createdAt,
        }));
    },
});

// Query to get specific organization data by key
export const getOrganizationDataByKey = query({
    /**
     * @description  : Query to get specific organization data by key.
     *                This query returns an object with the following properties:
     *                - key: The key of the data
     *                - value: The value of the data
     *                - analytics: The analytics data associated with the data
     *                - createdAt: The timestamp of when the data was created
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - dataKey: The key of the data to retrieve
     */
    args: { organizationId: v.id("organizations"), dataKey: v.string() },
    handler: async (ctx, args) => {
        const data = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .filter((q) => q.eq(q.field("data.key"), args.dataKey))
            .first();

        return data ? {
            key: data.data.key,
            value: data.data.value,
            analytics: data.analytics,
            createdAt: data.createdAt,
        } : null;
    },
});

// Query to get organization analytics by key
export const getOrganizationAnalyticsByKey = query({
    /**
     * @description  : Query to get organization analytics by key.
     *                This query returns an object with the following properties:
     *                - key: The key of the analytics data
     *                - value: The value of the analytics data
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - analyticsKey: The key of the analytics data to retrieve
     */
    args: { organizationId: v.id("organizations"), analyticsKey: v.string() },
    handler: async (ctx, args) => {
        const data = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .filter((q) => q.eq(q.field("analytics.key"), args.analyticsKey))
            .first();

        return data?.analytics ?? null;
    },
});

// Mutation to delete organization data
export const deleteOrganizationData = mutation({
    /**
     * @description  : Mutation to delete organization data.
     *                This mutation deletes the data associated with the given key.
     *                If the key does not exist, the mutation does nothing.
     * @param ctx    : The Convex context
     * @param args   : An object with the following properties:
     *                - organizationId: The ID of the organization
     *                - dataKey: The key of the data to delete
     */
    args: { organizationId: v.id("organizations"), dataKey: v.string() },
    handler: async (ctx, args) => {
        const dataToDelete = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .filter((q) => q.eq(q.field("data.key"), args.dataKey))
            .first();

        if (dataToDelete) {
            await ctx.db.delete(dataToDelete._id);
        }
    },
});
// Internal mutation for ACID-compliant data addition
const addData = mutation({
    args: {
        organizationId: v.id("organizations"),
        dataValue: v.string(),
        createdAt: v.string(),
    },
    handler: async (ctx, args) => {        // Check if the organization exists
        const organization = await ctx.db.get<{ _id: string }>(organizationId)
        if (!organization) {
            throw new ConvexError("Organization not found", { organizationId })
        }
        // Create the new data entry
        const data = { organizationId, data: { key: "", value: dataValue }, createdAt }
        // Insert the new data
        const dataId = await ctx.db.insert("organizationData", data)
        return { _id: dataId }
    },
})

