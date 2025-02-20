/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 05:48:37
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
/**
 * Renders the SignUp page with customized appearance settings for buttons and links.
 * 
 * @param {{ onSignUpSuccess?: () => void }} props - The component props.
 * @param {() => void} [props.onSignUpSuccess] - The callback function to be executed after a successful sign-up.
 * @returns {JSX.Element} - The rendered SignUp component.
 * @throws Will not throw any exceptions.
 */
import React from 'react';
import { SignUp } from "@clerk/nextjs"

export function SignUpPage({
    onSignUpSuccess,
}: {
    onSignUpSuccess?: () => void;
}): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-white rounded-lg shadow-md p-8 w-96">
                <h2 className="text-lg font-bold mb-4">Sign Up</h2>
                <SignUp
                    // Customize the appearance of the SignUp component
                    appearance={{
                        elements: {
                            // Customize the primary button style
                            formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
                            // Customize the footer link style
                            footerActionLink: "text-green-500 hover:text-green-600",
                        },
                    }}
                    // Set the routing mode to "path"
                    routing="path"
                    // Set the path to the sign-up page
                    path="/auth/sign-up"
                    // Set the URL to redirect to after a successful sign-up
                    signInUrl="/auth/sign-in"
                    // Set the URL to redirect to when the user is already signed in
                    signInFallbackRedirectUrl="/dashboard"
                    // Set the callback function to be executed after a successful sign-up
                    afterSignUpUrl={onSignUpSuccess ? onSignUpSuccess.toString() : undefined}
                />
            </div>
        </div>
    );
}
