/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:05:08
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { OpenAIStream, StreamingTextResponse } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export const runtime = "nodejs"

export async function POST(req: Request, { params }: { params: { organizationId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return new Response("Unauthorized", { status: 401 })
        }

        const { messages } = await req.json()
        const { organizationId } = params

        // Verify user has access to this organization
        const hasAccess = await db.organization.findFirst({
            where: {
                id: organizationId,
                members: {
                    some: {
                        userId,
                    },
                },
            },
        })

        if (!hasAccess) {
            return new Response("Unauthorized", { status: 401 })
        }

        // Get organization context from database
        const orgContext = await db.organization.findUnique({
            where: {
                id: organizationId,
            },
            select: {
                name: true,
                services: true,
                businessHours: true,
            },
        })

        // Create system message with organization context
        const systemMessage = {
            role: "system",
            content: `You are an AI assistant for ${orgContext?.name}, an auto detailing business. 
                You help customers with booking appointments and answering questions about our services.
                Available services: ${JSON.stringify(orgContext?.services)}
                Business hours: ${JSON.stringify(orgContext?.businessHours)}
                Please be professional, helpful, and concise in your responses.`,
        }

        // Create OpenAI stream
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [systemMessage, ...messages],
            temperature: 0.7,
            stream: true,
        })

        // Convert the response into a friendly stream
        const stream = OpenAIStream(response)

        // Return a StreamingTextResponse, which can be consumed by the client
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error("Chat API Error:", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}

