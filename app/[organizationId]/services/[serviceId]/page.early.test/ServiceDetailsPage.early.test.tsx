import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import ServiceDetailsPage from "../page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocking the necessary hooks and modules
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/convex/_generated/api", () => ({
  api: {
    services: {
      getServiceDetails: "getServiceDetails",
    },
  },
}));

describe("ServiceDetailsPage() ServiceDetailsPage method", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render service details correctly when data is available", () => {
      // Mocking useParams to return specific organizationId and serviceId
      (useParams as jest.Mock).mockReturnValue({
        organizationId: "org123",
        serviceId: "service123",
      });

      // Mocking useQuery to return a service object
      (useQuery as jest.Mock).mockReturnValue({
        name: "Service Name",
        description: "Service Description",
        price: 100,
        duration: 60,
        inclusions: ["Inclusion 1", "Inclusion 2"],
      });

      render(<ServiceDetailsPage />);

      // Assertions to check if the service details are rendered correctly
      expect(screen.getByText("Service Name")).toBeInTheDocument();
      expect(screen.getByText("Service Description")).toBeInTheDocument();
      expect(screen.getByText("Price: $100")).toBeInTheDocument();
      expect(screen.getByText("Duration: 60 minutes")).toBeInTheDocument();
      expect(screen.getByText("What's Included:")).toBeInTheDocument();
      expect(screen.getByText("Inclusion 1")).toBeInTheDocument();
      expect(screen.getByText("Inclusion 2")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Book This Service/i }),
      ).toHaveAttribute("href", "/org123/booking?serviceId=service123");
    });
  });

  describe("Edge Cases", () => {
    it("should display loading state when service data is not yet available", () => {
      // Mocking useParams to return specific organizationId and serviceId
      (useParams as jest.Mock).mockReturnValue({
        organizationId: "org123",
        serviceId: "service123",
      });

      // Mocking useQuery to return undefined to simulate loading state
      (useQuery as jest.Mock).mockReturnValue(undefined);

      render(<ServiceDetailsPage />);

      // Assertion to check if the loading state is displayed
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should handle empty inclusions gracefully", () => {
      // Mocking useParams to return specific organizationId and serviceId
      (useParams as jest.Mock).mockReturnValue({
        organizationId: "org123",
        serviceId: "service123",
      });

      // Mocking useQuery to return a service object with empty inclusions
      (useQuery as jest.Mock).mockReturnValue({
        name: "Service Name",
        description: "Service Description",
        price: 100,
        duration: 60,
        inclusions: [],
      });

      render(<ServiceDetailsPage />);

      // Assertions to check if the service details are rendered correctly without inclusions
      expect(screen.getByText("Service Name")).toBeInTheDocument();
      expect(screen.getByText("Service Description")).toBeInTheDocument();
      expect(screen.getByText("Price: $100")).toBeInTheDocument();
      expect(screen.getByText("Duration: 60 minutes")).toBeInTheDocument();
      expect(screen.queryByText("Inclusion 1")).not.toBeInTheDocument();
    });
  });
});
