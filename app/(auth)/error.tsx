/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 01:58:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"
import React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Oops! Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">We encountered an error while processing your request.</p>
                <p className="text-sm text-gray-500 text-center">{error.message}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => reset()} className="bg-[#00AE98] hover:bg-[#009B86] text-white">
                    Try again
                </Button>
            </CardFooter>
        </Card>
    )
}

