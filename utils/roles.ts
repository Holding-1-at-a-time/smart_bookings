/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 00:36:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// utils/roles.ts

import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (allowedRoles: Roles | Roles[]) => {
    const { sessionClaims } = await auth()
    const userRole = sessionClaims?.metadata.role as Roles

    if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(userRole)
    }

    return userRole === allowedRoles
}