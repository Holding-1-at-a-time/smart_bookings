/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 21:05:42
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to your error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <p className="text-muted-foreground">We apologize for the inconvenience.</p>
                <Button onClick={() => reset()}>Try again</Button>
            </div>
        </div>
    )
}

