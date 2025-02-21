/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:25:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { useQuery } from "convex/react"
import { Calendar, Briefcase, Users, Link } from "lucide-react"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

/**
 * DashboardPage
 *
 * This page renders the dashboard for the currently logged-in user.
 *
 * The page displays three cards with statistics about the user's bookings, services, and team members.
 * The page also displays a list of recent bookings and provides quick actions to add a new service,
 * invite a team member, and update business hours.
 *
 * @param {Object} params - The parameters passed to the page.
 * @param {string} params.organizationId - The ID of the organization to display.
 *
 * @returns {JSX.Element} A JSX element representing the dashboard page.
 */
export default function DashboardPage({ params }: { params: { organizationId: string } }) {
    const { userId } = auth()
    const organizationId = params.organizationId

    if (!userId || !organizationId) {
        redirect("/")
    }

    // Get the recent bookings for the organization
    const bookings = useQuery(api.bookings.getRecentBookings, { organizationId })
    // Get the count of services for the organization
    const services = useQuery(api.services.getServiceCount, { organizationId })
    // Get the count of members for the organization
    const members = useQuery(api.users.getMemberCount, { organizationId })

    if (bookings === undefined || services === undefined || members === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.length}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services}</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{members}</div>
                        <p className="text-xs text-muted-foreground">+2 new members this month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Booking&apos;s</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookings.length > 0 ? (
                            <ul className="space-y-2">
                                {bookings.map((booking: { _id: Key | null | undefined; serviceName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | null | undefined> | null | undefined; date: string | number | Date }) => (
                                    <li key={booking._id} className="flex justify-between items-center">
                                        <span>{booking.serviceName}</span>
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No recent bookings</p>
                        )}
                        <Button asChild className="w-full mt-4">
                            <Link href={`/dashboard/${organizationId}/bookings`}>View All Bookings</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href={`/dashboard/${organizationId}/services/new`}>Add New Service</Link>
                        </Button>
                        <Button asChild className="w-full">
                            <Link href={`/dashboard/${organizationId}/members/invite`}>Invite Team Member</Link>
                        </Button>
                        <Button asChild className="w-full">
                            <Link href={`/dashboard/${organizationId}/settings`}>Update Business Hours</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

