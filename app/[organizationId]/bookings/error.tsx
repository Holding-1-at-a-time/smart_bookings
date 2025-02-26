/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:15:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function BookingError({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Booking Error</h2>
            <p className="text-red-500 mb-4">Something went wrong while loading the booking page.</p>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    )
}

