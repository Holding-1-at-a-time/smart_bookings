/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 22:59:06
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * Convex schema definition for a booking system.
 *
 * The booking system stores information about organizations, users, services,
 * availability, bookings, and organization data.
 *
 * @author rrome
 * @group
 * @created 19/02/2025
 * @modified 19/02/2025
 */
import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * The organization table stores information about organizations.
 *
 * Each organization has a name, an owner ID, and settings such as timezone and
 * currency.
 */
export const organizations = defineTable({
  name: v.string(),
  ownerId: v.string(),
  settings: v.object({
    timezone: v.string(),
    currency: v.string(),
  }),
}).index("by_owner", ["ownerId"])

/**
 * The user table stores information about users.
 *
 * Each user has a token identifier, a Clerk ID, a name, an email address, and
 * other metadata.
 */
export const users = defineTable({
  organizationId: v.id("organizations"),
  tokenIdentifier: v.string(),
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  userName: v.optional(v.string()),
  firstName: v.string(),
  familyName: v.string(),
  phoneNumber: v.optional(v.string()),
  emailVerified: v.boolean(),
  hasVerifiedContactInfo: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
  metadata: v.any(),
  unsafeMetadata: v.any(),
  privateMetadata: v.any(),
  organizationName: v.optional(v.string()),
  organizationRole: v.optional(v.string()),
  organizationSlug: v.optional(v.string()),
  organizationLogo: v.optional(v.string()),
  hasOrgLogo: v.optional(v.boolean()),
  organizationPermissions: v.optional(v.array(v.string())),
})
  .index("by_token", ["tokenIdentifier"])
  .index("by_clerk_id", ["clerkId"])
  .index("by_organization", ["organizationId"])
  .index("by_name_email", ["name", "email"])

/**
 * The service table stores information about services.
 *
 * Each service has a name, a description, a duration, and a price.
 */
export const services = defineTable({
  organizationId: v.id("organizations"),
  name: v.string(),
  description: v.string(),
  duration: v.number(),
  price: v.number(),
}).index("by_organization", ["organizationId"])

/**
 * The availability table stores information about availability.
 *
 * Each availability has a day of the week, a start time, and an end time.
 */
export const availability = defineTable({
  organizationId: v.id("organizations"),
  dayOfWeek: v.number(),
  startTime: v.string(),
  endTime: v.string(),
}).index("by_organization", ["organizationId"])

/**
 * The booking table stores information about bookings.
 *
 * Each booking has a service ID, a user ID, a date, a start time, an end time,
 * and a status.
 */
export const bookings = defineTable({
  organizationId: v.id("organizations"),
  serviceId: v.id("services"),
  userId: v.id("users"),
  date: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  status: v.string(),
})
  .index("by_organization", ["organizationId"])
  .index("by_user", ["userId"])
  .index("by_time", ["startTime", "endTime"])

/**
 * The organization data table stores information about organization data.
 *
 * Each organization data has a key, a value, and a creation time.
 */
export const organizationData = defineTable({
  organizationId: v.id("organizations"),
  key: v.string(),
  value: v.string(),
  createdAt: v.string(),
})
  .index("by_organization", ["organizationId"])
  .index("by_organization_and_key", ["organizationId", "key"])

