/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:39:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import React, { type ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
        // You can log the error to an error reporting service here
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="max-w-md mx-auto mt-8">
                    <CardHeader>
                        <CardTitle>Oops! Something went wrong.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">We're sorry, but an error occurred while rendering this page.</p>
                        <p className="mb-4 text-sm text-gray-500">{this.state.error?.message}</p>
                        <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
                    </CardContent>
                </Card>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

