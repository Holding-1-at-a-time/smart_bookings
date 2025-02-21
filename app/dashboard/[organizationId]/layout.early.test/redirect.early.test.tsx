import React from "react";
import "@testing-library/jest-dom";
import { redirect } from "next/navigation";
import DashboardLayout from "../layout";

import { render } from "@testing-library/react";

// Mock the redirect function
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock the Clerk components
// jest.mock("@clerk/nextjs", () => ({
//   SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//   SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//   ClerkLoading: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//   ClerkLoaded: ({ children }: { children: React.ReactNode }) => <>{children}</>,
// }));

describe("redirect() redirect method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render children when user is signed in and Clerk is loaded", () => {
      const { getByText } = render(
        <DashboardLayout>
          <div>Dashboard Content</div>
        </DashboardLayout>,
      );

      expect(getByText("Dashboard Content")).toBeInTheDocument();
    });

    it("should show loading spinner when Clerk is loading", () => {
      // jest.mock("@clerk/nextjs", () => ({
      //         SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      //         SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      //         ClerkLoading: () => (
      //           <div className="flex items-center justify-center min-h-screen">
      //             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      //           </div>
      //         ),
      //         ClerkLoaded: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      //       }));

      const { container } = render(
        <DashboardLayout>
          <div>Dashboard Content</div>
        </DashboardLayout>,
      );

      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should redirect to home when user is signed out", () => {
      render(
        <DashboardLayout>
          <div>Dashboard Content</div>
        </DashboardLayout>,
      );

      expect(redirect).toHaveBeenCalledWith("/");
    });
  });
});
