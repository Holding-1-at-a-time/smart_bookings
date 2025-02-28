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
import type * as ai from "../ai.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as businesses from "../businesses.js";
import type * as customers from "../customers.js";
import type * as inventory from "../inventory.js";
import type * as notifications from "../notifications.js";
import type * as organizations from "../organizations.js";
import type * as organizationSettings from "../organizationSettings.js";
import type * as payments from "../payments.js";
import type * as pricingRequests from "../pricingRequests.js";
import type * as reinforcementLearning from "../reinforcementLearning.js";
import type * as scheduling from "../scheduling.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as staff_management from "../staff-management.js";
import type * as staff from "../staff.js";
import type * as users from "../users.js";
import type * as vehicles from "../vehicles.js";
import type * as weather from "../weather.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  analytics: typeof analytics;
  auth: typeof auth;
  bookings: typeof bookings;
  businesses: typeof businesses;
  customers: typeof customers;
  inventory: typeof inventory;
  notifications: typeof notifications;
  organizations: typeof organizations;
  organizationSettings: typeof organizationSettings;
  payments: typeof payments;
  pricingRequests: typeof pricingRequests;
  reinforcementLearning: typeof reinforcementLearning;
  scheduling: typeof scheduling;
  services: typeof services;
  settings: typeof settings;
  "staff-management": typeof staff_management;
  staff: typeof staff;
  users: typeof users;
  vehicles: typeof vehicles;
  weather: typeof weather;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
