/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 07:19:03
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import getBaseUrl from "@/utils/utils";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { afterEach } from "node:test";

global.window = undefined as any;

jest.mock("clsx", () => {
  return {
    clsx: jest.fn(),
  };
});

jest.mock("tailwind-merge", () => {
  return {
    twMerge: jest.fn(),
  };
});

describe("getBaseUrl() getBaseUrl method", () => {
  let originalWindow: any;
  let originalEnv: any;

  beforeAll(() => {
    originalWindow = global.window;
    originalEnv = process.env;
  });

  afterEach(() => {
    global.window = originalWindow;
    process.env = { ...originalEnv };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return an empty string when window is defined", () => {
      // Simulate browser environment
      global.window = {} as any;

      const result = getBaseUrl();
      expect(result).toBe("");
    });

    it("should return the VERCEL_URL when it is defined", () => {
      // Simulate server environment with VERCEL_URL
      global.window = undefined as any;
      process.env.VERCEL_URL = "example.vercel.app";

      const result = getBaseUrl();
      expect(result).toBe("https://example.vercel.app");
    });

    it('should return "http://localhost:3000" when window is undefined and VERCEL_URL is not set', () => {
      // Simulate server environment without VERCEL_URL
      global.window = undefined as any;
      delete process.env.VERCEL_URL;

      const result = getBaseUrl();
      expect(result).toBe("http://localhost:3000");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle undefined window gracefully", () => {
      // Simulate undefined window
      global.window = undefined as any;

      const result = getBaseUrl();
      expect(result).toBe("http://localhost:3000");
    });

    it("should handle empty VERCEL_URL gracefully", () => {
      // Simulate server environment with empty VERCEL_URL
      if ('window' in global) {
        global.window = undefined as any;

        process.env.VERCEL_URL = "";

        const result = getBaseUrl();
        expect(result).toBe("http://localhost:3000");
      }
    });
  });
});
