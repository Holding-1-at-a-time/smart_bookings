import React from "react";
import DataPage from "../page";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocking the DataComponent since it's not defined in the provided code
// jest.mock("@/app/dashboard/[organizationId]/data/DataComponent", () => {
//   return function MockDataComponent({ organizationId }: { organizationId: Id<"organizations"> }) {
//     return <div>Mock DataComponent for {organizationId}</div>;
//   };
// });

describe("DataPage() DataPage method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the main structure of the DataPage component", () => {
      // Test to ensure the main structure of the DataPage component is rendered correctly
      const { getByText } = render(
        <DataPage params={{ organizationId: "org-123" }} />,
      );
      expect(getByText("Organization Data")).toBeInTheDocument();
    });

    it("should pass the correct organizationId to DataComponent", () => {
      // Test to ensure the correct organizationId is passed to the DataComponent
      const { getByText } = render(
        <DataPage params={{ organizationId: "org-123" }} />,
      );
      expect(getByText("Mock DataComponent for org-123")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty organizationId gracefully", () => {
      // Test to ensure the component handles an empty organizationId gracefully
      const { getByText } = render(
        <DataPage params={{ organizationId: "" }} />,
      );
      expect(getByText("Mock DataComponent for ")).toBeInTheDocument();
    });

    it("should handle a very long organizationId", () => {
      // Test to ensure the component handles a very long organizationId
      const longOrgId = "org-" + "a".repeat(1000);
      const { getByText } = render(
        <DataPage params={{ organizationId: longOrgId }} />,
      );
      expect(
        getByText(`Mock DataComponent for ${longOrgId}`),
      ).toBeInTheDocument();
    });

    it("should handle special characters in organizationId", () => {
      // Test to ensure the component handles special characters in organizationId
      const specialCharOrgId = "org-!@#$%^&*()";
      const { getByText } = render(
        <DataPage params={{ organizationId: specialCharOrgId }} />,
      );
      expect(
        getByText(`Mock DataComponent for ${specialCharOrgId}`),
      ).toBeInTheDocument();
    });
  });
});
