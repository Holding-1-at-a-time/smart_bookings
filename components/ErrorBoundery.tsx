/**
 * @description      : A React error boundary component that catches errors and displays a custom error page.
 * @author           : rrome
 * @group            : 
 * @created          : 20/02/2025 - 16:30:59
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/02/2025
 * - Author          : rrome
 * - Modification    : 
**/

import React, { type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

/**
 * The props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
    /**
     * The children elements to render.
     */
    children: ReactNode
}

/**
 * The state for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
    /**
     * Whether an error has occurred.
     */
    hasError: boolean
    /**
     * The error that occurred, if any.
     */
    error?: Error
}

/**
 * A React error boundary component that catches errors and displays a custom error page.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    /**
     * The constructor for the ErrorBoundary component.
     * 
     * @param props The props for the ErrorBoundary component.
     */
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    /**
     * Updates the state with the error from the componentDidCatch method.
     * 
     * @param error The error that occurred.
     * @returns The updated state.
     */
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    /**
     * Catches errors and logs them to the console.
     * 
     * @param error The error that occurred.
     * @param errorInfo The error information.
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    /**
     * Renders the error boundary component.
     * 
     * If an error has occurred, displays a custom error page. Otherwise, renders the children elements.
     */
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
                    <p className="text-gray-400 mb-4">We&apos;re sorry for the inconvenience. Please try again later.</p>
                    <button
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

