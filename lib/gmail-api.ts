/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 17:25:35
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { google } from "googleapis"
import { renderToStaticMarkup } from "react-dom/server"
import { EmailTemplate } from "@/components/email-template"

const gmail = google.gmail("v1")

interface SendEmailProps {
    to: string
    subject: string
    templateType: "confirmation" | "reminder"
    templateData: {
        customerName: string
        serviceName: string
        date: string
        time: string
        businessName: string
        businessAddress: string
        businessPhone: string
    }
}

export async function sendEmail({ to, subject, templateType, templateData }: SendEmailProps) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS!),
            scopes: ["https://www.googleapis.com/auth/gmail.send"],
        })

        const emailContent = renderToStaticMarkup(<EmailTemplate type={ templateType } data = { templateData } />)

        const encodedMessage = Buffer.from(
            `To: ${to}\r\n` + `Subject: ${subject}\r\n` + `Content-Type: text/html; charset=utf-8\r\n\r\n` + emailContent,
        )
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")

        await gmail.users.messages.send({
            auth: auth,
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        })

        console.log(`Email sent successfully to ${to}`)
    } catch (error) {
        console.error("Error sending email:", error)
        throw new Error("Failed to send email")
    }
}

