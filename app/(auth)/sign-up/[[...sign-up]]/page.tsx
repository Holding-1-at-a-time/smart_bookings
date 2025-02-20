/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:28:39
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <SignUp
            appearance={{
                elements: {
                    formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
                    footerActionLink: "text-green-500 hover:text-green-600",
                },
            }}
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            redirectUrl="/dashboard"
        />
    );
}