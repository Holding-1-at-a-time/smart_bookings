/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:04:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { ChatInterface } from "@/components/chat-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatPageProps {
    params: {
        organizationId: string
    }
}

export default function ChatPage({ params }: ChatPageProps) {
    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChatInterface organizationId={params.organizationId} />
                </CardContent>
            </Card>
        </div>
    )
}

