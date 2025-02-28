/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 07:11:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

const roleCache = new Map<string, boolean>();

/**
 * Checks if the user's role is allowed based on the provided roles.
 * Uses a cache to store results and improve performance for subsequent calls with the same parameters.
 * @param allowedRoles - A single role or an array of roles that are permitted.
 * @returns A promise that resolves to a boolean indicating if the user's role is allowed.
 * @throws Will throw an error if the authentication fails or if the required session data is missing.
 */
export const checkRole = async (allowedRoles: Roles | Roles[]): Promise<boolean> => {
    const { sessionClaims } = await auth();

    if (!sessionClaims || !sessionClaims.metadata || !sessionClaims.metadata.role) {
        throw new Error("Missing required session data.");
    }

    const userRole = sessionClaims.metadata.role as Roles;
    const cacheKey = Array.isArray(allowedRoles) ? allowedRoles.join(',') : allowedRoles;

    if (roleCache.has(cacheKey)) {
        return roleCache.get(cacheKey)!;
    }

    let isAllowed: boolean;

    if (Array.isArray(allowedRoles)) {
        isAllowed = allowedRoles.includes(userRole);
    } else {
        isAllowed = userRole === allowedRoles;
    }

    roleCache.set(cacheKey, isAllowed);
    return isAllowed;
};
