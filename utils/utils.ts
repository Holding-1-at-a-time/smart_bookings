/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 21:04:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getBaseUrl() {
    if (typeof window !== "undefined") {
      return ""
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    return "http://localhost:3000"
}
export function getApiUrl() {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/api`
    }
    return "http://localhost:3000/api"
}
export function getApiUrlWithVersion(version: string) {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/api/${version}`
    }
    const url = getBaseUrl()
    return `${url}/api/${version}`
    }

