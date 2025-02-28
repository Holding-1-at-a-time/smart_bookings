/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 08:09:36
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function createAppointment(formData: FormData) {
    const { userId, orgId } = await auth()
    const user = await currentUser()

    if (!userId || !orgId) {
        throw new Error("You must be signed in to create an appointment")
    }

    //TODO: Add logic to create an appointment in the database using the form data and the organizationId
    // TODO: Add logic to send a confirmation email to the user with the appointment details
    //TODO: Add logic to send a notification email to the organization with the appointment details 
    // TODO: Add logic to update the user's schedule with the new appointment
    console.log("Creating appointment", {
        userId,
        orgId,
        userName: user?.firstName,
        appointmentData: Object.fromEntries(formData),
    })

    revalidatePath(`/dashboard/${orgId}/appointments`)
}

