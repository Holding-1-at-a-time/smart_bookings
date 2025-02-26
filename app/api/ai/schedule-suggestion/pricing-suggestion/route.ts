/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 25/02/2025 - 19:45:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { streamText } from "ai"
import { ollama } from "ollama-ai-provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages } = await req.json()

    const result = streamText({
        model: ollama("llama3.1: 8b"),
        system: "You are an AI assistant for an auto detailing business, helping with dynamic pricing suggestions.",
        messages,
    })

    return result.toDataStreamResponse()
}

