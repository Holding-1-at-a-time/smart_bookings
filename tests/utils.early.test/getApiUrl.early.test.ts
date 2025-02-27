import { getApiUrl } from "../../utils/utils";

// utils/utils.test.ts
// Mocking the environment variable
const originalEnv = process.env;

describe("getApiUrl() getApiUrl method", () => {
  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...originalEnv }; // Resets the environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restores the original environment variables
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return the Vercel API URL when VERCEL_URL is set", () => {
      // Arrange
      process.env.VERCEL_URL = "example.vercel.app";

      // Act
      const result = getApiUrl();

      // Assert
      expect(result).toBe("https://example.vercel.app/api");
    });

    it("should return the localhost API URL when VERCEL_URL is not set", () => {
      // Arrange
      delete process.env.VERCEL_URL;

      // Act
      const result = getApiUrl();

      // Assert
      expect(result).toBe("http://localhost:3000/api");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty VERCEL_URL gracefully", () => {
      // Arrange
      process.env.VERCEL_URL = "";

      // Act
      const result = getApiUrl();

      // Assert
      expect(result).toBe("http://localhost:3000/api");
    });

    it("should handle a malformed VERCEL_URL", () => {
      // Arrange
      process.env.VERCEL_URL = "http://malformed-url";

      // Act
      const result = getApiUrl();

      // Assert
      expect(result).toBe("https://http://malformed-url/api");
    });
  });
});
