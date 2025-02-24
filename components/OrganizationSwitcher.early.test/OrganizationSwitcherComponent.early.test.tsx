import React from "react";
import OrganizationSwitcherComponent from "../OrganizationSwitcher";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the OrganizationSwitcher component from @clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  OrganizationSwitcher: (props: any) => (
    <div {...props} data-testid="organization-switcher">
      Mocked OrganizationSwitcher
    </div>
  ),
}));

describe("OrganizationSwitcherComponent() OrganizationSwitcherComponent method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the OrganizationSwitcher component with default styles", () => {
      // This test checks if the OrganizationSwitcherComponent renders correctly with the default styles.
      const { getByTestId } = render(<OrganizationSwitcherComponent />);
      const switcher = getByTestId("organization-switcher");
      expect(switcher).toBeInTheDocument();
      expect(switcher).toHaveClass("flex items-center");
    });

    it("should apply the correct styles to the organizationSwitcherTrigger", () => {
      // This test verifies that the organizationSwitcherTrigger has the correct styles applied.
      const { getByTestId } = render(<OrganizationSwitcherComponent />);
      const switcher = getByTestId("organization-switcher");
      expect(switcher).toHaveClass(
        "py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200",
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle rendering without crashing when no props are passed", () => {
      // This test ensures that the component does not crash when no props are passed.
      const { getByTestId } = render(<OrganizationSwitcherComponent />);
      const switcher = getByTestId("organization-switcher");
      expect(switcher).toBeInTheDocument();
    });

    it("should handle unexpected props gracefully", () => {
      // This test checks if the component can handle unexpected props without breaking.
      const { getByTestId } = render(
        <OrganizationSwitcherComponent unexpectedProp="unexpected" />,
      );
      const switcher = getByTestId("organization-switcher");
      expect(switcher).toBeInTheDocument();
    });
  });
});
