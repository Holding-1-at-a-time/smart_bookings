/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:39:12
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface PaymentGatewayProps {
    amount: number
    onSuccess: () => void
}

export function PaymentGateway({ amount, onSuccess }: PaymentGatewayProps) {
    const { organizationId } = useParams()
    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")

    const processPayment = useMutation(api.payments.processPayment)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await processPayment({
                organizationId: organizationId as string,
                amount,
                cardNumber,
                expiryDate,
                cvv,
            })

            toast({
                title: "Payment Successful",
                description: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
            })

            onSuccess()
        } catch (error) {
            console.error("Error processing payment:", error)
            toast({
                title: "Payment Failed",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" required />
                    </div>
                    <Button type="submit">Pay ${amount.toFixed(2)}</Button>
                </form>
            </CardContent>
        </Card>
    )
}

