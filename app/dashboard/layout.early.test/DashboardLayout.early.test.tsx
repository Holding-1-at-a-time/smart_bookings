import DashboardLayout from "../layout";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

// Mocking the components from external libraries
jest.mock("@clerk/clerk-react", () => ({
  OrganizationSwitcher: () => <div>OrganizationSwitcher</div>,
  UserButton: () => <div>UserButton</div>,
}));

jest.mock("next/link", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("DashboardLayout() DashboardLayout method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the DashboardLayout with children", () => {
      // Test to ensure the component renders with children
      render(
        <DashboardLayout>
          <div>Child Component</div>
        </DashboardLayout>,
      );
      expect(screen.getByText("Child Component")).toBeInTheDocument();
    });

    it("should render the header with the correct title", () => {
      // Test to ensure the header contains the correct title
      render(
        <DashboardLayout>
          <div />
        </DashboardLayout>,
      );
      expect(screen.getByText("Smart Booking's")).toBeInTheDocument();
    });

    it("should render the OrganizationSwitcher and UserButton components", () => {
      // Test to ensure the OrganizationSwitcher and UserButton are rendered
      render(
        <DashboardLayout>
          <div />
        </DashboardLayout>,
      );
      expect(screen.getByText("OrganizationSwitcher")).toBeInTheDocument();
      expect(screen.getByText("UserButton")).toBeInTheDocument();
    });

    it("should have a link to the dashboard", () => {
      // Test to ensure the link to the dashboard is present
      render(
        <DashboardLayout>
          <div />
        </DashboardLayout>,
      );
      const linkElement = screen.getByText("Smart Booking's").closest("a");
      expect(linkElement).toHaveAttribute("href", "/dashboard");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should render correctly without children", () => {
      // Test to ensure the component renders correctly even if no children are provided
      render(<DashboardLayout>{null}</DashboardLayout>);
      expect(screen.getByText("Smart Booking's")).toBeInTheDocument();
    });

    it("should handle unexpected children types gracefully", () => {
      // Test to ensure the component handles unexpected children types
      render(<DashboardLayout>{123}</DashboardLayout>);
      expect(screen.getByText("Smart Booking's")).toBeInTheDocument();
    });
  });
});
