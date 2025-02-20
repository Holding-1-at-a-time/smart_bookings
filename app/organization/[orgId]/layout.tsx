/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:13:54
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

export default function OrgDetailLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    const params = useParams();
    const { orgId } = params as { orgId: string };
    return (
        <div>
            <header className="p-4 bg-gray-100">
                <nav className="flex gap-4">
                    <Link href={`/organization/${orgId}/dashboard`} className="hover:underline">
                        Dashboard
                    </Link>
                    <Link href={`/organization/${orgId}/settings`} className="hover:underline">
                        Settings
                    </Link>
                </nav>
            </header>
            <main className="p-4">{children}</main>
        </div>
    );
}
