/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:03:37
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type { Message } from "ai"
import { Loader2 } from "lucide-react"

interface AIResponseGeneratorProps {
    isLoading: boolean
    lastMessage?: Message
}

export function AIResponseGenerator({ isLoading, lastMessage }: AIResponseGeneratorProps) {
    if (!isLoading && !lastMessage) return null

    return (
        <div className="flex items-center space-x-2">
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">AI is thinking...</p>
                </>
            ) : (
                <p className="text-sm">{lastMessage?.content}</p>
            )}
        </div>
    )
}

