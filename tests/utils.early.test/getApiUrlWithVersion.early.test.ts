/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 07:00:50
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { describe, expect, it } from "@jest/globals";
import { getApiUrlWithVersion } from "../../utils/utils";

// utils.test.ts
describe("getApiUrlWithVersion() getApiUrlWithVersion method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return the correct API URL with version when VERCEL_URL is set", () => {
      // Arrange
      const version = "v1";
      process.env.VERCEL_URL = "example.vercel.app";

      // Act
      const result = getApiUrlWithVersion(version);

      // Assert
      expect(result).toBe("https://example.vercel.app/api/v1");
    });

    it("should return the correct API URL with version when VERCEL_URL is not set", () => {
      // Arrange
      const version = "v2";
      delete process.env.VERCEL_URL;

      // Act
      const result = getApiUrlWithVersion(version);

      // Assert
      expect(result).toBe("http://localhost:3000/api/v2");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty version string gracefully", () => {
      // Arrange
      const version = "";
      delete process.env.VERCEL_URL;

      // Act
      const result = getApiUrlWithVersion(version);

      // Assert
      expect(result).toBe("http://localhost:3000/api/");
    });

    it("should handle a version string with special characters", () => {
      // Arrange
      const version = "v1.0.0-beta!";
      delete process.env.VERCEL_URL;

      // Act
      const result = getApiUrlWithVersion(version);

      // Assert
      expect(result).toBe("http://localhost:3000/api/v1.0.0-beta!");
    });

    it("should handle a very long version string", () => {
      // Arrange
      const version = "v" + "1".repeat(1000);
      delete process.env.VERCEL_URL;

      // Act
      const result = getApiUrlWithVersion(version);

      // Assert
      expect(result).toBe(`http://localhost:3000/api/${version}`);
    });
  });
});
