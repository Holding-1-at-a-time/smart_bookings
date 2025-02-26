/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:15:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useOrganizationList, useOrganization } from "@clerk/nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function OrganizationSwitcher() {
    const { organizationList, isLoaded } = useOrganizationList()
    const { organization } = useOrganization()
    const router = useRouter()

    if (!isLoaded) {
        return null
    }

    const handleOrganizationChange = (orgId: string) => {
        router.push(`/dashboard/${orgId}`)
    }

    return (
        <Select onValueChange={handleOrganizationChange} value={organization?.id}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
                {organizationList.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                        {org.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

