/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:01:38
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignIn } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
    const SignInButton = () => {
        return (
            <>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className={"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md te..."}
                                ref={ref}
                                component={SignIn}
                            >
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }
}
