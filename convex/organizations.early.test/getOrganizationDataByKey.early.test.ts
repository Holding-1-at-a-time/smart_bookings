import { getOrganizationDataByKey } from "../organizations";

describe("getOrganizationDataByKey() getOrganizationDataByKey method", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("Happy Paths", () => {
    it("should return organization data when it exists", async () => {
      // Arrange: Set up the mock database to return a specific record
      const mockData = {
        _id: "123",
        key: "testKey",
        value: "testValue",
        createdAt: "2025-02-20T00:23:33Z",
      };
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(mockData),
      });

      // Act: Call the function with valid arguments
      const result = await getOrganizationDataByKey.handler(ctx, {
        organizationId: "org123",
        key: "testKey",
      });

      // Assert: Verify the function returns the expected data
      expect(result).toEqual({
        id: "123",
        key: "testKey",
        value: "testValue",
        createdAt: "2025-02-20T00:23:33Z",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return null when no data exists for the given key", async () => {
      // Arrange: Set up the mock database to return no record
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(null),
      });

      // Act: Call the function with a key that does not exist
      const result = await getOrganizationDataByKey.handler(ctx, {
        organizationId: "org123",
        key: "nonExistentKey",
      });

      // Assert: Verify the function returns null
      expect(result).toBeNull();
    });

    it("should handle case sensitivity in keys", async () => {
      // Arrange: Set up the mock database to return a specific record
      const mockData = {
        _id: "123",
        key: "TestKey",
        value: "testValue",
        createdAt: "2025-02-20T00:23:33Z",
      };
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(mockData),
      });

      // Act: Call the function with a key in different case
      const result = await getOrganizationDataByKey.handler(ctx, {
        organizationId: "org123",
        key: "testkey",
      });

      // Assert: Verify the function returns null due to case sensitivity
      expect(result).toBeNull();
    });

    it("should handle invalid organizationId gracefully", async () => {
      // Arrange: Set up the mock database to return no record
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(null),
      });

      // Act: Call the function with an invalid organizationId
      const result = await getOrganizationDataByKey.handler(ctx, {
        organizationId: "invalidOrgId",
        key: "testKey",
      });

      // Assert: Verify the function returns null
      expect(result).toBeNull();
    });
  });
});
