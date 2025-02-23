/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 21:06:23
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Page Not Found</h2>
                <p className="text-muted-foreground">Could not find requested resource</p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}

