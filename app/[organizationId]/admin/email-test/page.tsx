/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 17:29:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { api } from "../convex/_generated/api";



export default function EmailTest() {
    const { organizationId } = useParams()
    const [testEmail, setTestEmail] = useState("")
    const [isSending, setIsSending] = useState(false)

    const sendNotificationEmail =(useMutation(api.notifications.sendNotificationEmail);

    const handleSendTestEmail = async () => {
        if (!testEmail) {
            toast({
                title: "Error",
                description: "Please enter a test email address.",
                variant: "destructive",
            })
            return
        }

        setIsSending(true)
        try {
            await sendNotificationEmail({
                organizationId: organizationId as string,
                to: testEmail,
                subject: "Test Email from Auto Detailing AI",
                templateType: "confirmation",
                templateData: {
                    customerName: "Test User",
                    serviceName: "Test Service",
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    businessName: "Auto Detailing AI",
                    businessAddress: "123 Test St, Test City, TS 12345",
                    businessPhone: "(555) 555-5555",
                },
            })

            toast({
                title: "Success",
                description: "Test email sent successfully. Please check your inbox.",
            })
        } catch (error) {
            console.error("Error sending test email:", error)
            toast({
                title: "Error",
                description: "Failed to send test email. Please check your credentials and try again.",
                variant: "destructive",
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Integration Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="testEmail">Test Email Address</Label>
                    <Input
                        id="testEmail"
                        type="email"
                        placeholder="Enter test email address"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                    />
                </div>
                <Button onClick={handleSendTestEmail} disabled={isSending}>
                    {isSending ? "Sending..." : "Send Test Email"}
                </Button>
            </CardContent>
        </Card>
    )
}

