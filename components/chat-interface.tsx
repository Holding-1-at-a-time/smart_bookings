/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:03:19
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { AIResponseGenerator } from "@/components/ai-response-generator"

interface ChatInterfaceProps {
    organizationId: string
}

export function ChatInterface({ organizationId }: ChatInterfaceProps) {
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const { messages, input, handleInputChange, handleSubmit, error } = useChat({
        api: `/api/chat/${organizationId}`,
        onError: (error) => {
            console.error("Chat error:", error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            })
        },
        onFinish: () => {
            setIsLoading(false)
        },
    })

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        await handleSubmit(e)
    }

    return (
        <div className="flex flex-col space-y-4 h-[600px]">
            <ScrollArea className="flex-grow p-4 border rounded-lg" ref={scrollAreaRef}>
                {messages.map((message) => (
                    <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div
                            className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                <AIResponseGenerator isLoading={isLoading} lastMessage={messages[messages.length - 1]} />
            </ScrollArea>

            <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                </Button>
            </form>
        </div>
    )
}

