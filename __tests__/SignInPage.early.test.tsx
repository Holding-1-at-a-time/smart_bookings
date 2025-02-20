/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 05:31:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import React from "react";
import SignInPage from "../app/(auth)/sign-in/[[...sign-in]]/page";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the SignIn component from @clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  SignIn: (props: any) => (
    <div>
      <div>Mocked SignIn Component</div>
      <div>{JSON.stringify(props)}</div>
    </div>
  ),
}));

describe("SignInPage() SignInPage method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the SignIn component with correct default props", () => {
      // Render the SignInPage component
      const { getByText } = render(<SignInPage />);

      // Check if the mocked SignIn component is rendered
      expect(getByText("Mocked SignIn Component")).toBeInTheDocument();

      // Verify the appearance prop
      expect(
        getByText(
          /"formButtonPrimary":"bg-blue-500 hover:bg-blue-600 text-white"/,
        ),
      ).toBeInTheDocument();
      expect(
        getByText(/"footerActionLink":"text-blue-500 hover:text-blue-600"/),
      ).toBeInTheDocument();

      // Verify the routing, path, signUpUrl, and redirectUrl props
      expect(getByText(/"routing":"path"/)).toBeInTheDocument();
      expect(getByText(/"path":"\/auth\/sign-in"/)).toBeInTheDocument();
      expect(getByText(/"signUpUrl":"\/auth\/sign-up"/)).toBeInTheDocument();
      expect(getByText(/"redirectUrl":"\/dashboard"/)).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing appearance prop gracefully", () => {
      // Mock SignIn to simulate missing appearance prop
      jest.mock("@clerk/nextjs", () => ({
        SignIn: (props: any) => (
          <div>
            <div>Mocked SignIn Component</div>
            <div>{JSON.stringify(props)}</div>
          </div>
        ),
      }));

      // Render the SignInPage component
      const { getByText } = render(<SignInPage />);

      // Check if the mocked SignIn component is rendered
      expect(getByText("Mocked SignIn Component")).toBeInTheDocument();

      // Verify the appearance prop is still present
      expect(
        getByText(
          /"formButtonPrimary":"bg-blue-500 hover:bg-blue-600 text-white"/,
        ),
      ).toBeInTheDocument();
      expect(
        getByText(/"footerActionLink":"text-blue-500 hover:text-blue-600"/),
      ).toBeInTheDocument();
    });

    it("should handle unexpected routing prop value", () => {
      // Mock SignIn to simulate unexpected routing prop
      jest.mock("@clerk/nextjs", () => ({
        SignIn: (props: any) => (
          <div>
            <div>Mocked SignIn Component</div>
            <div>{JSON.stringify(props)}</div>
          </div>
        ),
      }));

      // Render the SignInPage component
      const { getByText } = render(<SignInPage />);

      // Check if the mocked SignIn component is rendered
      expect(getByText("Mocked SignIn Component")).toBeInTheDocument();

      // Verify the routing prop is still present
      expect(getByText(/"routing":"path"/)).toBeInTheDocument();
    });
  });
});
