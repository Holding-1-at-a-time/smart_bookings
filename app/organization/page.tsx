/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:20:44
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import React from 'react';
import { OrganizationList, CreateOrganization } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { JSX } from 'react/jsx-runtime';

export default async function OrganizationPage(): Promise<JSX.Element> {
    const user = await currentUser();
    if (!user) {
        return <div>You are not signed in.</div>;
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Organization Management</h1>
            <div className="my-4">
                <OrganizationList />
            </div>
            <div className="my-4">
                <CreateOrganization />
            </div>
        </div>
    );
}
