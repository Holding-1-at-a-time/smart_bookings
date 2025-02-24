/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 01:58:54
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthLoading() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#00AE98]" />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-center">Loading authentication...</p>
            </CardContent>
        </Card>
    )
}

