/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:05:56
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CustomersPage({ params }: { params: { organizationId: string } }) {
    // This is a placeholder. In a real application, you would fetch the customers from your API.
    const customers = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs />
            <h1 className="text-3xl font-bold mb-6">Customers</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Email</th>
                            <th className="border px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="border px-4 py-2">{customer.name}</td>
                                <td className="border px-4 py-2">{customer.email}</td>
                                <td className="border px-4 py-2">
                                    <Link href={`/${params.organizationId}/customers/${customer.id}/profile`}>
                                        <Button variant="outline" size="sm" className="mr-2">
                                            View Profile
                                        </Button>
                                    </Link>
                                    <Link href={`/${params.organizationId}/customers/${customer.id}/appointments`}>
                                        <Button variant="outline" size="sm">
                                            View Appointments
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

