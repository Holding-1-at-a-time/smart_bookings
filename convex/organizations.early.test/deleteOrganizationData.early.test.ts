import { deleteOrganizationData } from "../organizations";

jest.mock("../_generated/server", () => ({
  mutation: jest.fn(),
}));

describe("deleteOrganizationData() deleteOrganizationData method", () => {
  let ctx: any;
  let args: any;

  beforeEach(() => {
    ctx = {
      db: {
        query: jest.fn(),
        delete: jest.fn(),
      },
    };
    args = {
      organizationId: "org123",
      key: "testKey",
    };
  });

  describe("Happy Paths", () => {
    it("should delete the organization data when it exists", async () => {
      // Arrange: Mock the database query to return a valid data entry
      const mockData = {
        _id: "data123",
        key: "testKey",
        organizationId: "org123",
      };
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(mockData),
      });

      // Act: Call the deleteOrganizationData function
      const result = await deleteOrganizationData.handler(ctx, args);

      // Assert: Verify that the data was deleted and the function returns true
      expect(ctx.db.delete).toHaveBeenCalledWith("data123");
      expect(result).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should return false when the organization data does not exist", async () => {
      // Arrange: Mock the database query to return no data
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(null),
      });

      // Act: Call the deleteOrganizationData function
      const result = await deleteOrganizationData.handler(ctx, args);

      // Assert: Verify that no data was deleted and the function returns false
      expect(ctx.db.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should handle cases where the key is an empty string", async () => {
      // Arrange: Set the key to an empty string
      args.key = "";

      // Mock the database query to return no data
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(null),
      });

      // Act: Call the deleteOrganizationData function
      const result = await deleteOrganizationData.handler(ctx, args);

      // Assert: Verify that no data was deleted and the function returns false
      expect(ctx.db.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should handle cases where the organizationId is invalid", async () => {
      // Arrange: Set an invalid organizationId
      args.organizationId = "invalidOrgId";

      // Mock the database query to return no data
      ctx.db.query.mockReturnValueOnce({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce(null),
      });

      // Act: Call the deleteOrganizationData function
      const result = await deleteOrganizationData.handler(ctx, args);

      // Assert: Verify that no data was deleted and the function returns false
      expect(ctx.db.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
