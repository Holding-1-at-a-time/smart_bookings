/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as availability from "../availability.js";
import type * as bookings from "../bookings.js";
import type * as notifications from "../notifications.js";
import type * as organizations from "../organizations.js";
import type * as organizationSettings from "../organizationSettings.js";
import type * as pricingRequests from "../pricingRequests.js";
import type * as reinforcementLearning from "../reinforcementLearning.js";
import type * as services from "../services.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  availability: typeof availability;
  bookings: typeof bookings;
  notifications: typeof notifications;
  organizations: typeof organizations;
  organizationSettings: typeof organizationSettings;
  pricingRequests: typeof pricingRequests;
  reinforcementLearning: typeof reinforcementLearning;
  services: typeof services;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
