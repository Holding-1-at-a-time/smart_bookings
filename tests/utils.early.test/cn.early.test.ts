import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn } from "../../utils/utils";

// utils/utils.test.ts

// utils/utils.test.ts
// Mocking the clsx and twMerge functions
jest.mock("clsx", () => ({
  clsx: jest.fn(),
}));

jest.mock("tailwind-merge", () => ({
  twMerge: jest.fn(),
}));

// MockClassValue to simulate ClassValue behavior
type MockClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | MockClassArray
  | MockClassDictionary;

type MockClassArray = MockClassValue[];

interface MockClassDictionary {
  [key: string]: boolean | undefined;
}

describe("cn() cn method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path tests
  describe("Happy paths", () => {
    it("should merge class names correctly", () => {
      // Arrange
      const mockInputs: MockClassValue[] = ["class1", "class2"];
      jest.mocked(clsx).mockReturnValue("class1 class2" as any);
      jest.mocked(twMerge).mockReturnValue("class1 class2" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("class1 class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle empty input gracefully", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [];
      jest.mocked(clsx).mockReturnValue("" as any);
      jest.mocked(twMerge).mockReturnValue("" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("");
      expect(result).toBe("");
    });
  });

  // Edge case tests
  describe("Edge cases", () => {
    it("should handle null and undefined values", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [null, undefined, "class1"];
      jest.mocked(clsx).mockReturnValue("class1" as any);
      jest.mocked(twMerge).mockReturnValue("class1" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("class1");
      expect(result).toBe("class1");
    });

    it("should handle boolean values", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [true, false, "class1"];
      jest.mocked(clsx).mockReturnValue("class1" as any);
      jest.mocked(twMerge).mockReturnValue("class1" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("class1");
      expect(result).toBe("class1");
    });

    it("should handle numeric values", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [1, 0, "class1"];
      jest.mocked(clsx).mockReturnValue("1 0 class1" as any);
      jest.mocked(twMerge).mockReturnValue("1 0 class1" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("1 0 class1");
      expect(result).toBe("1 0 class1");
    });

    it("should handle complex nested structures", () => {
      // Arrange
      const mockInputs: MockClassValue[] = [
        { class1: true, class2: false },
        ["class3", null, "class4"],
      ];
      jest.mocked(clsx).mockReturnValue("class1 class3 class4" as any);
      jest.mocked(twMerge).mockReturnValue("class1 class3 class4" as any);

      // Act
      const result = cn(...(mockInputs as any));

      // Assert
      expect(clsx).toHaveBeenCalledWith(mockInputs as any);
      expect(twMerge).toHaveBeenCalledWith("class1 class3 class4");
      expect(result).toBe("class1 class3 class4");
    });
  });
});
