/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 08:59:29
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage({ params }: { params: { organizationId: string } }) {
    const { userId, orgId } = auth().protect()

    if (!userId) {
        redirect("/sign-in")
    }

    if (!orgId) {
        redirect("/org-selection")
    }

    if (orgId !== params.organizationId) {
        redirect(`/dashboard/${orgId}`)
    }

    const user = await auth().user

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You are viewing the dashboard for organization: {orgId}</p>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={`/dashboard/${orgId}/appointments`}>Manage Appointments</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={`/dashboard/${orgId}/services`}>Manage Services</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

