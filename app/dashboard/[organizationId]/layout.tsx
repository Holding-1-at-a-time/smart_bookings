/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:52:37
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import Link from "next/link";
import OrganizationSwitcherComponent from "@/components/OrganizationSwitcher";

export default function DashboardLayout({ children, params }: { children: React.ReactNode; params: { organizationId: string } }) {
    return (
        <div className="flex">
            <aside className="w-64 min-h-screen bg-gray-100 p-4">
                <OrganizationSwitcherComponent />
                <nav className="mt-8">
                    <ul className="space-y-2">
                        <li><Link href={`/dashboard/${params.organizationId}`} className="block py-2 px-4 rounded hover:bg-gray-200">Overview</Link></li>
                        <li><Link href={`/dashboard/${params.organizationId}/members`} className="block py-2 px-4 rounded hover:bg-gray-200">Members</Link></li>
                        <li><Link href={`/dashboard/${params.organizationId}/settings`} className="block py-2 px-4 rounded hover:bg-gray-200">Settings</Link></li>
                        <li><Link href={`/dashboard/${params.organizationId}/data`} className="block py-2 px-4 rounded hover:bg-gray-200">Data</Link></li>
                    </ul>
                </nav>
            </aside>
            <div className="flex-grow p-8">
                {children}
            </div>
        </div>
    );
}