import React from "react";
import CustomerLayout from "../layout";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the MobileNavigation component
jest.mock("@/components/mobile-navigation", () => ({
  MobileNavigation: () => (
    <div data-testid="mobile-navigation">Mobile Navigation</div>
  ),
}));

// Mock the useParams hook
jest.mock("next/navigation", () => ({
  useParams: () => ({ organizationId: "test-org" }),
}));

describe("CustomerLayout() CustomerLayout method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the header with navigation links", () => {
      // Render the component with children
      render(
        <CustomerLayout>
          <div>Test Content</div>
        </CustomerLayout>,
      );

      // Check if the header links are rendered correctly
      expect(screen.getByText("Auto Detailing AI")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Book Now")).toBeInTheDocument();
      expect(screen.getByText("Chat")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should render the children content", () => {
      // Render the component with children
      render(
        <CustomerLayout>
          <div>Test Content</div>
        </CustomerLayout>,
      );

      // Check if the children content is rendered
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render the footer with the current year", () => {
      // Render the component with children
      render(
        <CustomerLayout>
          <div>Test Content</div>
        </CustomerLayout>,
      );

      // Check if the footer is rendered with the current year
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(
          `© ${currentYear} Auto Detailing AI. All rights reserved.`,
        ),
      ).toBeInTheDocument();
    });

    it("should render the MobileNavigation component", () => {
      // Render the component with children
      render(
        <CustomerLayout>
          <div>Test Content</div>
        </CustomerLayout>,
      );

      // Check if the MobileNavigation component is rendered
      expect(screen.getByTestId("mobile-navigation")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing organizationId gracefully", () => {
      // Mock useParams to return undefined organizationId
      jest.mock("next/navigation", () => ({
        useParams: () => ({ organizationId: undefined }),
      }));

      // Render the component with children
      render(
        <CustomerLayout>
          <div>Test Content</div>
        </CustomerLayout>,
      );

      // Check if the header links are rendered with undefined organizationId
      expect(screen.getByText("Auto Detailing AI")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Book Now")).toBeInTheDocument();
      expect(screen.getByText("Chat")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });
});
