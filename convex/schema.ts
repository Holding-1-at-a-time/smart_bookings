/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:45:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { userInfo } from "os"

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    organizationMembers: v.array(v.id("organizationMembers")),
    ownerId: v.string(),
    tokenIdentifier: v.string(),
    settings: v.object({
      timezone: v.string(),
      currency: v.string(),
      locale: v.string(),
      address: v.string(),
      phone: v.string(),
      email: v.string(),
      businessHours: v.string(),
      website: v.string(),
      logo: v.optional(v.string()),
      slug: v.string(),
      updatedAt: v.any(),
    }),
    holidays: v.array(v.object({
      date: v.string(),
      name: v.string(),
    })),
    users: v.array(v.string()),
    roles: v.array(v.string()),

    metadata: v.optional(v.any()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_name", ["name"])
    .index("by_owner", ["ownerId"]),

  businessHours: defineTable({
    organizationId: v.id("organizations"),
    day: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    hours: v.array(v.object({
      dayOfWeek: v.number(),
      start: v.string(),
      end: v.string(),
    })),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_day", ["organizationId", "day"]),


  users: defineTable({
    organizationId: v.id("organizations"),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    metadata: v.optional(v.any()),
    updatedAt: v.string(),
    userSessions: v.array(v.object({
      token: v.string(),
      refreshToken: v.string(),
    })),
    sessions: v.array(v.object({
      token: v.string(),
      createdAt: v.string(),
      updatedAt: v.string(),
      refreshToken: v.string(),
    }))
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_organization_and_role", ["organizationId", "role"]),

  serviceCategories: defineTable({
    id: v.id("serviceCategories"),
    organizationId: v.id("organizations"),
    category: v.array(v.object({
      id: v.id("serviceCategories"),
      name: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
      isActive: v.boolean(),
    })),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_organization", ["organizationId"])
    .index("by_name", ["name"])
    .index("by_order", ["order"])
    .index("by_organization_and_name", ["organizationId", "name"])
    .index("by_organization_and_order", ["organizationId", "order"]),

  services: defineTable({
    organizationId: v.id("organizations"),
    serviceCategoryId: v.id("serviceCategories"),
    categoryId: v.id("serviceCategories"),
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
  })
    .index("by_organization", ["organizationId"])
    .index("by_category", ["categoryId"])
    .index("by_name", ["name"])
    .index("by_duration", ["duration"])
    .index("by_base_price", ["basePrice"])
    .index("by isActive", ["isActive"]),

  availability: defineTable({
    organizationId: v.id("organizations"),
    providerId: v.id("users"),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    serviceId: v.id("services"),
    isRecurring: v.boolean(),
    date: v.optional(v.string())
  })
    .index("by_organization", ["organizationId"])
    .index("by_day_of_week", ["dayOfWeek"])
    .index("by_provider", ["providerId"])
    .index("by_start_time", ["startTime"])
    .index("by_end_time", ["endTime"])
    .index("by_organization_and_day_of_week", ["organizationId", "dayOfWeek"]),

  bookings: defineTable({
    organizationId: v.id("organizations"),
    serviceId: v.id("services"),
    userId: v.id("users"),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    status: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    totalPrice: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_by_date", ["organizationId", "date"])
    .index("by_user", ["userId"])
    .index("by_service", ["serviceId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_customer_name", ["customerName"])
    .index("by_customer_email", ["customerEmail"])
    .index("by_customer_phone", ["customerPhone"]),

  organizationData: defineTable({
    organizationId: v.id("organizations"),
    key: v.string(),
    value: v.string(),
    createdAt: v.string(),
  })
    .index("by_key", ["key"])
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_key", ["organizationId", "key"])
    .index("by_organization_and_value", ["organizationId", "value"])
    .index("by_organization_and_key_and_value", ["organizationId", "key", "value"]),

  bookingFeedback: defineTable({
    organizationId: v.id("organizations"),
    bookingId: v.id("bookings"),
    feedback: v.string(),
    userId: v.id("users"),
    rating: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_booking", ["bookingId"])
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_organization_and_booking", ["organizationId", "bookingId"])
    .index("by_organization_and_user", ["organizationId", "userId"])
    .index("by_organization_and_rating", ["organizationId", "rating"])
    .index("by_organization_and_comment", ["organizationId", "comment"]),

  rlModel: defineTable({
    organizationId: v.id("organizations"),
    policyParams: v.string(), // JSON string of policy parameters
    valueFunction: v.string(), // JSON string of value function
    environmentModel: v.string(), // JSON string of environment model
    lastUpdated: v.string(),
  }).index("by_organization", ["organizationId"])
    .index("by_policy_params", ["policyParams"])
    .index("by_value_function", ["valueFunction"])
    .index("by_environment_model", ["environmentModel"])
    .index("by_last_updated", ["lastUpdated"]),

  rlTrainingData: defineTable({
    organizationId: v.id("organizations"),
    state: v.string(), // JSON string of state
    action: v.string(),
    reward: v.number(),
    nextState: v.string(), // JSON string of next state
    createdAt: v.string(),
  }).index("by_organization", ["organizationId"])
    .index("by_state", ["state"])
    .index("by_action", ["action"])
    .index("by_reward", ["reward"])
    .index("by_next_state", ["nextState"])
    .index("by_created_at", ["createdAt"]),


  pricingRequests: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    requestType: v.string(),
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
    createdAt: v.string(),
  }).index("by_tier", ["tier"])
    .index("by_price", ["price"])
    .index("by_business_name", ["businessName"])
    .index("by_name", ["name"])
    .index("by_organization", ["organizationId"]),

  staff: defineTable({

    organizationId: v.id("organizations"),
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    specialties: v.array(v.string()),
    isActive: v.boolean(),
    updatedAt: v.string(),
    createdAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_organization_and_role", ["organizationId", "role"]),

  // New table for customer profiles
  customers: defineTable({
    organizationId: v.id("organizations"),
    customerId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    preferredServices: v.array(v.id("services")),
    lastVisit: v.optional(v.string()),
    totalVisits: v.number(),
    totalSpent: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_last_visit", ["lastVisit"])
    .index("by_total_visits", ["totalVisits"])
    .index("by_total_spent", ["totalSpent"]),

  // New table for promotions and discounts
  promotions: defineTable({
    organizationId: v.id("organizations"),
    promotionId: v.id("promotions"),
    name: v.string(),
    description: v.string(),
    discountType: v.string(), // e.g., "percentage", "fixed_amount"
    discountValue: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    applicableServices: v.array(v.id("services")),
    isActive: v.boolean(),
    usageLimit: v.optional(v.number()),
    usageCount: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_start_date", ["startDate"])
    .index("by_end_date", ["endDate"])
    .index("by_is_active", ["isActive"]),

  // New table for inventory management
  inventory: defineTable({
    organizationId: v.id("organizations"),
    inventoryId: v.id("inventory"),
    productCode: v.string(),
    itemName: v.string(),
    category: v.string(),
    quantity: v.number(),
    unit: v.string(),
    reorderPoint: v.number(),
    supplierInfo: v.optional(v.string()),
    lastRestockDate: v.optional(v.string()),
    cost: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_category", ["category"])
    .index("by_quantity", ["quantity"]),

  // New table for AI-generated insights
  aiInsights: defineTable({
    organizationId: v.id("organizations"),
    insightType: v.string(), // e.g., "scheduling_optimization", "pricing_suggestion", "customer_retention"
    content: v.string(),
    generatedAt: v.string(),
    appliedAt: v.optional(v.string()),
    impact: v.optional(
      v.object({
        metric: v.string(),
        value: v.number(),
      }),
    ),
  })
    .index("by_organization", ["organizationId"])
    .index("by_insight_type", ["insightType"])
    .index("by_generated_at", ["generatedAt"]),

  organizationMembers: defineTable({
    userId: v.id("users"),
    organizationId: v.string(),
    role: v.string(),
    joinedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_user_and_org", ["userId", "organizationId"]),

  notificationTemplates: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    templateType: v.string(),
    templateContent: v.string(),
    created_at: v.string(),
    createdBy: v.string(),
    sendTo: v.string(),
    templateData: v.string(),
    templateId: v.id("notificationTemplates"),
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_name", ["name"])
    .index("by_organization_and_template_type", ["organizationId", "templateType"])
    .index("by_organization_and_template_id", ["organizationId", "templateId"])
    .index("by_organization_and_user", ["organizationId", "userId"])
    .index("by_organization_and_name", ["organizationId", "name"]),
})