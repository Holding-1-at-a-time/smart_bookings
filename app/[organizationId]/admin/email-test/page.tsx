/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 20:11:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
export default function EmailTestPage({ params }: { params: { organizationId: string } }) {
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const sendTestEmail = useMutation(api.email.sendTest)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await sendTestEmail({
                organizationId: params.organizationId,
                email,
                subject,
                message,
            })
            toast({
                title: "Email Sent",
                description: "Test email has been sent successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send test email. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Email Test</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Send Test Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Recipient Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Test Email"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

