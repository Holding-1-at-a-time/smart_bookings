/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 06:42:00
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { getServices } from "../services";
import { jest } from "@jest/globals";
// Mocking the context and dependencies
const mockCtx = {
  auth: {
    getUserIdentity: jest.fn(),
  },
  db: {
    query: jest.fn(),
  },
};

jest.mock("../organizations", () => ({
  getOrganizationById: jest.fn(),
}));

describe("getServices() getServices method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should retrieve services for a valid organization and user", async () => {
      // Arrange
      const mockIdentity = {
        tokenIdentifier: "user-token",
        name: "John Doe",
        email: "john@example.com",
      };
      const mockOrganizationId = "org-123";
      const mockServices = [{ _id: "service-1", name: "Service 1" }];

      mockCtx.auth.getUserIdentity.mockResolvedValue(mockIdentity);
      require("./organizations").getOrganizationById.mockResolvedValue(
        mockOrganizationId,
      );
      mockCtx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        collect: jest.fn().mockResolvedValue(mockServices),
      });

      const args = { organizationId: mockOrganizationId };

      // Act
      const result = await getServices.handler(mockCtx, args);

      // Assert
      expect(result).toEqual(mockServices);
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
      expect(
        require("./organizations").getOrganizationById,
      ).toHaveBeenCalledWith(mockCtx, mockIdentity.tokenIdentifier);
      expect(mockCtx.db.query).toHaveBeenCalledWith("services");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should throw an error if user is unauthenticated", async () => {
      // Arrange
      mockCtx.auth.getUserIdentity.mockResolvedValue(null);
      const args = { organizationId: "org-123" };

      // Act & Assert
      await expect(getServices.handler(mockCtx, args)).rejects.toThrow(
        "Unauthenticated call to mutation",
      );
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
    });

    it("should throw an error if organization mismatch occurs", async () => {
      // Arrange
      const mockIdentity = { tokenIdentifier: "user-token" };
      const mockOrganizationId = "org-123";

      mockCtx.auth.getUserIdentity.mockResolvedValue(mockIdentity);
      require("./organizations").getOrganizationById.mockResolvedValue(
        "different-org-id",
      );
      const args = { organizationId: mockOrganizationId };

      // Act & Assert
      await expect(getServices.handler(mockCtx, args)).rejects.toThrow(
        "Organization mismatch. User does not belong to this organization.",
      );
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
      expect(
        require("./organizations").getOrganizationById,
      ).toHaveBeenCalledWith(mockCtx, mockIdentity.tokenIdentifier);
    });

    it("should handle database query errors gracefully", async () => {
      // Arrange
      const mockIdentity = { tokenIdentifier: "user-token" };
      const mockOrganizationId = "org-123";

      mockCtx.auth.getUserIdentity.mockResolvedValue(mockIdentity);
      require("./organizations").getOrganizationById.mockResolvedValue(
        mockOrganizationId,
      );
      mockCtx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        collect: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const args = { organizationId: mockOrganizationId };

      // Act & Assert
      await expect(getServices.handler(mockCtx, args)).rejects.toThrow(
        "Failed to retrieve services",
      );
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
      expect(
        require("./organizations").getOrganizationById,
      ).toHaveBeenCalledWith(mockCtx, mockIdentity.tokenIdentifier);
      expect(mockCtx.db.query).toHaveBeenCalledWith("services");
    });
  });
});
