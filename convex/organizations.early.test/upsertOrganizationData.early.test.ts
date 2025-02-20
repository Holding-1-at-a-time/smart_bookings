import { v } from "convex/values";
import { upsertOrganizationData } from "../organizations";

describe("upsertOrganizationData() upsertOrganizationData method", () => {
  let ctx: any;

  beforeEach(() => {
    // Mock the context and database methods
    ctx = {
      db: {
        query: jest.fn(),
        patch: jest.fn(),
        insert: jest.fn(),
      },
    };
  });

  describe("Happy paths", () => {
    it("should update existing organization data when key exists", async () => {
      // Arrange: Mock existing data
      const existingData = { _id: "existingId", value: "oldValue" };
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(existingData),
        }),
      });

      // Act: Call the function
      await upsertOrganizationData.handler(ctx, {
        organizationId: v.id("organizations", "org1"),
        key: "testKey",
        value: "newValue",
      });

      // Assert: Check if patch was called
      expect(ctx.db.patch).toHaveBeenCalledWith("existingId", {
        value: "newValue",
      });
    });

    it("should insert new organization data when key does not exist", async () => {
      // Arrange: Mock no existing data
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act: Call the function
      await upsertOrganizationData.handler(ctx, {
        organizationId: v.id("organizations", "org1"),
        key: "newKey",
        value: "newValue",
      });

      // Assert: Check if insert was called
      expect(ctx.db.insert).toHaveBeenCalledWith("organizationData", {
        organizationId: v.id("organizations", "org1"),
        key: "newKey",
        value: "newValue",
        createdAt: expect.any(String),
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty value gracefully", async () => {
      // Arrange: Mock existing data
      const existingData = { _id: "existingId", value: "oldValue" };
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(existingData),
        }),
      });

      // Act: Call the function with an empty value
      await upsertOrganizationData.handler(ctx, {
        organizationId: v.id("organizations", "org1"),
        key: "testKey",
        value: "",
      });

      // Assert: Check if patch was called with empty value
      expect(ctx.db.patch).toHaveBeenCalledWith("existingId", { value: "" });
    });

    it("should handle non-existent organizationId gracefully", async () => {
      // Arrange: Mock no existing data
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act: Call the function with a non-existent organizationId
      await upsertOrganizationData.handler(ctx, {
        organizationId: v.id("organizations", "nonExistentOrg"),
        key: "newKey",
        value: "newValue",
      });

      // Assert: Check if insert was called
      expect(ctx.db.insert).toHaveBeenCalledWith("organizationData", {
        organizationId: v.id("organizations", "nonExistentOrg"),
        key: "newKey",
        value: "newValue",
        createdAt: expect.any(String),
      });
    });

    it("should handle special characters in key and value", async () => {
      // Arrange: Mock no existing data
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act: Call the function with special characters
      await upsertOrganizationData.handler(ctx, {
        organizationId: v.id("organizations", "org1"),
        key: "special!@#$%^&*()",
        value: "valueWithSpecialChars!@#$%^&*()",
      });

      // Assert: Check if insert was called
      expect(ctx.db.insert).toHaveBeenCalledWith("organizationData", {
        organizationId: v.id("organizations", "org1"),
        key: "special!@#$%^&*()",
        value: "valueWithSpecialChars!@#$%^&*()",
        createdAt: expect.any(String),
      });
    });
  });
});
