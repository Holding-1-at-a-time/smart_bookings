import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "../../utils/roles";

// utils/roles.test.ts

// utils/roles.test.ts
// Mock the auth function
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

describe("checkRole() checkRole method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy paths
  describe("Happy paths", () => {
    it("should return true when user role matches the allowed role", async () => {
      // Arrange
      const userRole: Roles = "admin";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole("admin");

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when user role is in the allowed roles array", async () => {
      // Arrange
      const userRole: Roles = "manager";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole(["admin", "manager", "client"]);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user role does not match the allowed role", async () => {
      // Arrange
      const userRole: Roles = "client";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole("admin");

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user role is not in the allowed roles array", async () => {
      // Arrange
      const userRole: Roles = "detailer";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole(["admin", "manager"]);

      // Assert
      expect(result).toBe(false);
    });
  });

  // Edge cases
  describe("Edge cases", () => {
    it("should return false when sessionClaims is undefined", async () => {
      // Arrange
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: undefined,
      });

      // Act
      const result = await checkRole("admin");

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when role is not present in sessionClaims", async () => {
      // Arrange
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: {} },
      });

      // Act
      const result = await checkRole("admin");

      // Assert
      expect(result).toBe(false);
    });

    it("should handle an empty allowedRoles array gracefully", async () => {
      // Arrange
      const userRole: Roles = "admin";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole([]);

      // Assert
      expect(result).toBe(false);
    });

    it("should handle a null allowedRoles gracefully", async () => {
      // Arrange
      const userRole: Roles = "admin";
      (auth as jest.Mock).mockResolvedValue({
        sessionClaims: { metadata: { role: userRole } },
      });

      // Act
      const result = await checkRole(null as unknown as Roles);

      // Assert
      expect(result).toBe(false);
    });
  });
});
