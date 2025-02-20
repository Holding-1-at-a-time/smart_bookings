/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 15:34:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        card: "bg-gray-800 border-gray-700",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-300",
                        socialButtonsBlockButton: "border-gray-700 text-white",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-gray-700 border-gray-600 text-white",
                        footerActionLink: "text-primary hover:text-primary/90",
                    },
                }}
            />
        </div>
    )
}

