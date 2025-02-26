import React from "react";
import ErrorBoundary from "../ErrorBoundery";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocking the ErrorBoundaryProps interface
interface MockErrorBoundaryProps {
  children: React.ReactNode;
}

describe("ErrorBoundary.render() render method", () => {
  // Happy path: Test that children are rendered when no error occurs
  it("should render children when no error occurs", () => {
    const mockProps: MockErrorBoundaryProps = {
      children: <div>Child Component</div>,
    } as any;

    render(<ErrorBoundary {...mockProps} />);
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  // Edge case: Test that an error message is displayed when an error occurs
  it("should display error message when an error occurs", () => {
    const mockProps: MockErrorBoundaryProps = {
      children: <div>Child Component</div>,
    } as any;

    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary {...mockProps}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  // Edge case: Test that the "Something went wrong" message is displayed when hasError is true
  it('should display "Something went wrong" message when hasError is true', () => {
    const mockProps: MockErrorBoundaryProps = {
      children: <div>Child Component</div>,
    } as any;

    const errorBoundary = new ErrorBoundary(mockProps);
    errorBoundary.setState({ hasError: true });

    render(<ErrorBoundary {...mockProps} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  // Edge case: Test the "Try again" button functionality
  it('should reset error state when "Try again" button is clicked', () => {
    const mockProps: MockErrorBoundaryProps = {
      children: <div>Child Component</div>,
    } as any;

    const errorBoundary = new ErrorBoundary(mockProps);
    errorBoundary.setState({ hasError: true });

    render(<ErrorBoundary {...mockProps} />);
    fireEvent.click(screen.getByText("Try again"));

    expect(errorBoundary.state.hasError).toBe(false);
  });
});
