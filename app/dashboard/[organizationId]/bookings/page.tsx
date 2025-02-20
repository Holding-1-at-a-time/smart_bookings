/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 15:57:21
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * BookingsPage
 *
 * This page renders the bookings list or calendar component for the currently logged-in user.
 *
 * The page is protected by Clerk's authentication middleware, so only logged-in users can access it.
 *
 * @returns A JSX element representing the bookings page.
 */

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export default async function BookingsPage() {
    /**
     * Get the currently logged-in user's ID and organization ID from Clerk's authentication middleware.
     *
     * If the user is not logged in, redirect them to the homepage.
     */
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        redirect("/")
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Bookings</h1>
            {/* Add your bookings list or calendar component here */}
        </div>
    )
}

