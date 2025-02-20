import { listOrganizationData } from "../organizations";

describe("listOrganizationData() listOrganizationData method", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("Happy Paths", () => {
    it("should return a list of organization data when valid organizationId and count are provided", async () => {
      // Arrange
      const organizationId = "org123";
      const count = 2;
      const mockData = [
        {
          _id: "1",
          key: "key1",
          value: "value1",
          createdAt: "2025-02-20T00:00:00Z",
        },
        {
          _id: "2",
          key: "key2",
          value: "value2",
          createdAt: "2025-02-21T00:00:00Z",
        },
      ];
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        take: jest.fn().mockResolvedValue(mockData),
      });

      // Act
      const result = await listOrganizationData.handler(ctx, {
        organizationId,
        count,
      });

      // Assert
      expect(result.data).toEqual([
        {
          id: "1",
          key: "key1",
          value: "value1",
          createdAt: "2025-02-20T00:00:00Z",
        },
        {
          id: "2",
          key: "key2",
          value: "value2",
          createdAt: "2025-02-21T00:00:00Z",
        },
      ]);
    });

    it("should return data starting from the cursor if provided", async () => {
      // Arrange
      const organizationId = "org123";
      const count = 2;
      const cursor = "1";
      const mockData = [
        {
          _id: "2",
          key: "key2",
          value: "value2",
          createdAt: "2025-02-21T00:00:00Z",
        },
        {
          _id: "3",
          key: "key3",
          value: "value3",
          createdAt: "2025-02-22T00:00:00Z",
        },
      ];
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        take: jest.fn().mockResolvedValue(mockData),
      });

      // Act
      const result = await listOrganizationData.handler(ctx, {
        organizationId,
        count,
        cursor,
      });

      // Assert
      expect(result.data).toEqual([
        {
          id: "2",
          key: "key2",
          value: "value2",
          createdAt: "2025-02-21T00:00:00Z",
        },
        {
          id: "3",
          key: "key3",
          value: "value3",
          createdAt: "2025-02-22T00:00:00Z",
        },
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("should return an empty list if no data is found for the given organizationId", async () => {
      // Arrange
      const organizationId = "org123";
      const count = 2;
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        take: jest.fn().mockResolvedValue([]),
      });

      // Act
      const result = await listOrganizationData.handler(ctx, {
        organizationId,
        count,
      });

      // Assert
      expect(result.data).toEqual([]);
    });

    it("should handle a large count gracefully", async () => {
      // Arrange
      const organizationId = "org123";
      const count = 1000; // Large count
      const mockData = Array.from({ length: 1000 }, (_, i) => ({
        _id: `${i}`,
        key: `key${i}`,
        value: `value${i}`,
        createdAt: `2025-02-20T00:00:00Z`,
      }));
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        take: jest.fn().mockResolvedValue(mockData),
      });

      // Act
      const result = await listOrganizationData.handler(ctx, {
        organizationId,
        count,
      });

      // Assert
      expect(result.data.length).toBe(1000);
    });

    it("should handle invalid cursor gracefully", async () => {
      // Arrange
      const organizationId = "org123";
      const count = 2;
      const cursor = "invalid_cursor";
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        take: jest.fn().mockResolvedValue([]),
      });

      // Act
      const result = await listOrganizationData.handler(ctx, {
        organizationId,
        count,
        cursor,
      });

      // Assert
      expect(result.data).toEqual([]);
    });
  });
});
