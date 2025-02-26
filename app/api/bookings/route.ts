/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:18:42
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { createBooking } from "@/lib/bookings"

export async function POST(req: Request) {
    const { userId, orgId } = auth().protect()

    const body = await req.json()
    const { serviceId, date, time } = body

    try {
        const booking = await createBooking({ userId, orgId, serviceId, date, time })
        return NextResponse.json(booking)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }
}

