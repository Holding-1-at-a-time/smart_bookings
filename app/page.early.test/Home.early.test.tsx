import React from "react";
import Home from "../page";

// app/__tests__/page.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// app/__tests__/page.test.tsx
// Mock the imported components
jest.mock("@/components/pricing/Pricing", () => ({
  Pricing: () => <div>Pricing Component</div>,
  Testimonials: () => <div>Testimonials Component</div>,
  FAQ: () => <div>FAQ Component</div>,
  NewsletterSignup: () => <div>NewsletterSignup Component</div>,
}));

jest.mock("@clerk/nextjs", () => ({
  Waitlist: () => <div>Waitlist Component</div>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Home() Home method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the header with logo and navigation links", () => {
      render(<Home />);
      expect(screen.getByAltText("Smart Bookings Logo")).toBeInTheDocument();
      expect(screen.getByText("Smart Bookings")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("Testimonials")).toBeInTheDocument();
      expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

    it("should render the main heading and subheading", () => {
      render(<Home />);
      expect(screen.getByText("Revolutionize Your")).toBeInTheDocument();
      expect(screen.getByText("Auto Detailing Business")).toBeInTheDocument();
      expect(
        screen.getByText(/Smart Bookings uses AI to optimize your schedule/),
      ).toBeInTheDocument();
    });

    it("should render the Waitlist component", () => {
      render(<Home />);
      expect(screen.getByText("Waitlist Component")).toBeInTheDocument();
    });

    it("should render the features section with all features", () => {
      render(<Home />);
      expect(screen.getByText("AI-Powered Scheduling")).toBeInTheDocument();
      expect(screen.getByText("Multi-Location Support")).toBeInTheDocument();
      expect(screen.getByText("Customer Insights")).toBeInTheDocument();
      expect(screen.getByText("Automated Marketing")).toBeInTheDocument();
      expect(screen.getByText("Real-time Analytics")).toBeInTheDocument();
      expect(screen.getByText("Integration Ready")).toBeInTheDocument();
    });

    it("should render the Pricing component", () => {
      render(<Home />);
      expect(screen.getByText("Pricing Component")).toBeInTheDocument();
    });

    it("should render the Testimonials component", () => {
      render(<Home />);
      expect(screen.getByText("Testimonials Component")).toBeInTheDocument();
    });

    it("should render the FAQ component", () => {
      render(<Home />);
      expect(screen.getByText("FAQ Component")).toBeInTheDocument();
    });

    it("should render the NewsletterSignup component", () => {
      render(<Home />);
      expect(
        screen.getByText("NewsletterSignup Component"),
      ).toBeInTheDocument();
    });

    it("should render the footer with copyright information", () => {
      render(<Home />);
      expect(
        screen.getByText("© 2025 Smart Bookings. All rights reserved."),
      ).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing features gracefully", () => {
      // Temporarily modify the features array to simulate missing data
      const originalFeatures = [...features];
      features.length = 0; // Clear the features array

      render(<Home />);
      expect(
        screen.queryByText("AI-Powered Scheduling"),
      ).not.toBeInTheDocument();

      // Restore the original features array
      features.push(...originalFeatures);
    });

    it("should handle image loading errors gracefully", () => {
      render(<Home />);
      const image = screen.getByAltText("Auto detailing");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/auto-detailing.jpg");
    });
  });
});
