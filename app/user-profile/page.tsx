/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:02:02
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { UserProfile } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserProfilePage() {
    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserProfile
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                                card: "shadow-none",
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

