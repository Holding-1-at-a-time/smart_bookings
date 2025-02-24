/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:01:49
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignUp } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                                footerActionLink: "text-[#00AE98] hover:text-[#009B86]",
                                card: "shadow-none",
                            },
                        }}
                        redirectUrl="/onboarding"
                    />
                </CardContent>
            </Card>
        </div>
    )
}

