import { handleConvexError } from "../errorHnadler";

// utils/errorHandler.test.ts
// Mock class to simulate AppError
class MockAppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

describe("handleConvexError() handleConvexError method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should rethrow the error if it is an instance of AppError", () => {
      // Arrange: Create a mock AppError
      const mockError = new MockAppError(400, "Bad Request") as any;

      // Act & Assert: Expect handleConvexError to throw the same error
      expect(() => handleConvexError(mockError)).toThrow(mockError);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should throw a new AppError with status 500 for unknown errors", () => {
      // Arrange: Create a generic error
      const genericError = new Error("Some generic error");

      // Act & Assert: Expect handleConvexError to throw a new AppError
      expect(() => handleConvexError(genericError)).toThrow(MockAppError);
      expect(() => handleConvexError(genericError)).toThrow(
        expect.objectContaining({
          statusCode: 500,
          message: "An unexpected error occurred",
        }),
      );
    });

    it("should handle non-error objects gracefully", () => {
      // Arrange: Use a non-error object
      const nonErrorObject = { some: "object" };

      // Act & Assert: Expect handleConvexError to throw a new AppError
      expect(() => handleConvexError(nonErrorObject)).toThrow(MockAppError);
      expect(() => handleConvexError(nonErrorObject)).toThrow(
        expect.objectContaining({
          statusCode: 500,
          message: "An unexpected error occurred",
        }),
      );
    });

    it("should handle null or undefined input gracefully", () => {
      // Act & Assert: Expect handleConvexError to throw a new AppError for null
      expect(() => handleConvexError(null)).toThrow(MockAppError);
      expect(() => handleConvexError(null)).toThrow(
        expect.objectContaining({
          statusCode: 500,
          message: "An unexpected error occurred",
        }),
      );

      // Act & Assert: Expect handleConvexError to throw a new AppError for undefined
      expect(() => handleConvexError(undefined)).toThrow(MockAppError);
      expect(() => handleConvexError(undefined)).toThrow(
        expect.objectContaining({
          statusCode: 500,
          message: "An unexpected error occurred",
        }),
      );
    });
  });
});
