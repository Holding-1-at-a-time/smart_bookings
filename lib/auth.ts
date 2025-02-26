/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:19:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { jwtVerify, createRemoteJWKSet } from "jose"

const JWKS = createRemoteJWKSet(new URL(process.env.CLERK_JWKS_URL!))

export async function verifyAuth(token: string) {
    try {
        const verified = await jwtVerify(token, JWKS, {
            issuer: process.env.CLERK_ISSUER,
            audience: process.env.CLERK_AUDIENCE,
        })

        return {
            isValid: true,
            payload: verified.payload,
        }
    } catch (error) {
        return {
            isValid: false,
            payload: null,
        }
    }
}

