/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:28:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/


import { SignIn } from "@clerk/nextjs";

/**
 * Renders the SignIn page with customized appearance settings for buttons and links.
 * 
 * @returns JSX.Element - The rendered SignIn component.
 * @throws Will not throw any exceptions.
 */
export default function SignInPage() {
    return (
        <SignIn
            appearance={{
                elements: {
                    formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
                    footerActionLink: "text-blue-500 hover:text-blue-600",
                },
            }}
            routing="path"
            path="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            redirectUrl="/dashboard"
        />
    );
}