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
'use client'

import { SignUp } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"
export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [verifying, setVerifying] = React.useState(false)
    const [code, setCode] = React.useState('')
    const router = useRouter()


    // Handle submission of the sign-up form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoaded) {
            return
        }

        // Start the sign-up process using the email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send the user an email with the verification code
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            })

            // Set 'verifying' true to display second form
            // and capture the OTP code
            setVerifying(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle the submission of the verification form
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoaded) {

        try {
            // Use the code the user provided to attempt verification
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.push('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            console.error('Error:', JSON.stringify(err, null, 2))
            toast({
                title: "Error",
                description: "There was an error verifying your email. Please try again.",
                variant: "destructive",
            })
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling

        }
    }

    // Display the verification form to capture the OTP code
    if (verifying) {
        return (
            <>
                <h1>Verify your email</h1>
                <form onSubmit={handleVerify}>
                    <label id="code">Enter your verification code</label>
                    <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
                    <button type="submit">Verify</button>
                </form>
            </>
        )
    }

    return (
        <>
            <h1>Sign up</h1>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email">Enter email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Enter password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* CAPTCHA Widget */}
                            <div id="clerk-captcha"></div>

                            <div>
                                <button type="submit">Next</button>
                            </div>
                        </form>
                        <SignUp
                            appearance={{
                                elements: {
                                    formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                                    footerActionLink: "text-[#00AE98] hover:text-[#009B86]",
                                    card: "shadow-none",
                                },
                            }} />
                    </CardContent> 
                </Card>
            </div>
        </>
    )
}
}
