/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:26:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import React from "react";
export default function OrganizationSwitcherComponent() {
    return (
        <OrganizationSwitcher
            appearance={{
                elements: {
                    rootBox: "flex items-center",
                    organizationSwitcherTrigger: "py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200",
                },
            }}
        />
    );
}