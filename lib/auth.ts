/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 10:42:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * Verifies a Clerk authentication token.
 *
 * @param {string} token The token to verify.
 * @returns {Promise<{ isValid: boolean; payload: JWT | null }>}
 */
export async function verifyAuth(token: string): Promise<{ isValid: boolean; payload: JWT | null }> {
    try {
        const verified = await verifyJwt<string>(token, JWKS, {
            issuer: process.env.CLERK_JWT_ISSUER_DOMAIN!,
            audience: process.env.CLERK_AUDIENCE,
        });

        return {
            isValid: true,
            payload: verified,
        }
    } catch (error) {
        return {
            isValid: false,
            payload: null,
        }
    }
}