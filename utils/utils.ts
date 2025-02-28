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
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


const DEV_BASE_URL = "http://localhost:3000";
const PROD_BASE_URL_FALLBACK = "https://your-fallback-url.com"; // Replace with your fallback URL

/**console.log("DEV_BASE_URL:", DEV_BASE_URL);
console.log("PROD_BASE_URL_FALLBACK:", PROD_BASE_URL_FALLBACK);

console.log("isAbsoluteUrl function loaded");

console.log("cn function loaded");

console.log("getBaseUrl function loaded");

console.log("getApiUrl function loaded");

console.log("getApiUrlWithVersion function loaded");
 * Checks if the given URL is absolute.
 * 
 * @param url - The URL to check.
 * @returns `true` if the URL is absolute, `false` otherwise.
 */
const isAbsoluteUrl = (url: string): boolean => {
    try {
        // Attempt to create a URL object from the given string
        const parsedUrl = new URL(url);

        // If the URL is absolute, the protocol will be set
        return parsedUrl.protocol !== "";
    } catch (error) {
        // If an error is thrown, the URL is not absolute
        return false;
    }
};


/**
 * Combines class names using `clsx` and merges Tailwind CSS classes using `twMerge`.
 * 
 * @param inputs - An array of class values to be combined and merged.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
/**
 * Gets the base URL of the application.
 * 
 * - Uses the `VERCEL_URL` environment variable if available.
 * - Defaults to `http://localhost:3000` for local development.
 * - Defaults to a fallback URL for production if `VERCEL_URL` is not set or invalid.
 * 
 * @returns The base URL as a string.
 */
export default function getBaseUrl(): string {
    if (process.env.NODE_ENV === "development") {
        return DEV_BASE_URL;
    }

    const vercelUrl = process.env.VERCEL_URL;

    if (vercelUrl && isAbsoluteUrl(vercelUrl)) {
        return `https://${vercelUrl}`;
    }

    if (process.env.NODE_ENV === "production") {
        console.warn("VERCEL_URL is not set or invalid. Using fallback URL.");
        return PROD_BASE_URL_FALLBACK;
    }

    console.warn("VERCEL_URL is not set or invalid. Defaulting to fallback URL.");
    return PROD_BASE_URL_FALLBACK; // Or handle this differently if not production
}
    /**
     * Gets the API URL of the application.
     * 
     * - Uses the `VERCEL_URL` environment variable if available.
     * - Defaults to `http://localhost:3000/api` for local development.
     * 
     * @returns The API URL as a string.
     */
    /**
     * Retrieves the API URL based on the deployment environment.
     * If the VERCEL_URL environment variable is set, it returns the production URL; otherwise, it defaults to the local development URL.
     * 
     * @returns {string} The API URL.
     * @throws {Error} Throws an error if the environment variable is not set and the local server is unreachable.
     */
    export function getApiUrl(): string {
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}/api`;
        }
        return "http://localhost:3000/api";
    }

    /**
     * Gets the API URL with a specific version.
     * 
     * - Uses the `VERCEL_URL` environment variable if available.
     * - Defaults to `http://localhost:3000/api/<version>` for local development.
     * 
     * @param version - The API version to be appended to the URL.
     * @returns The versioned API URL as a string.
     */
    export function getApiUrlWithVersion(version: string): string {
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}/api/${version}`;
        }
        const url = getBaseUrl();
        return `${url}/api/${version}`;
    }

