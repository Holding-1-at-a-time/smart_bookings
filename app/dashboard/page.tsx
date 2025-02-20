/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 15:34:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default async function DashboardPage() {
    const { userId } = auth()
    const user = await currentUser()

    if (!userId) {
        redirect("/sign-in")
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Smart Booking's Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                rootBox: "flex",
                                organizationSwitcherTrigger: "bg-gray-700 text-white px-4 py-2 rounded-md",
                            },
                        }}
                    />
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            },
                        }}
                    />
                </div>
            </header>
            <main className="p-8">
                <h2 className="text-3xl mb-4">Welcome, {user?.firstName}!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard title="Bookings" link="/dashboard/bookings">
                        Manage your bookings
                    </DashboardCard>
                    <DashboardCard title="Services" link="/dashboard/services">
                        Manage your services
                    </DashboardCard>
                    <DashboardCard title="Availability" link="/dashboard/availability">
                        Set your availability
                    </DashboardCard>
                </div>
            </main>
        </div>
    )
}

function DashboardCard({ title, children, link }: { title: string; children: React.ReactNode; link: string }) {
    return (
        <Link href={link} className="block">
            <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-300">{children}</p>
            </div>
        </Link>
    )
}

