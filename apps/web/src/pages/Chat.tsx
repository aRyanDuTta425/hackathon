import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Send, Loader2 } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface ChatSession {
  id: string
  messages: Message[]
}

export default function Chat() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { data: chatSession } = useQuery<ChatSession>({
    queryKey: ['chatSession'],
    queryFn: async () => {
      const response = await axios.get('/api/chat/session')
      return response.data
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await axios.post('/api/chat/message', { message })
      return response.data
    },
    onSuccess: () => {
      setInput('')
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    },
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatSession?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    try {
      await sendMessageMutation.mutateAsync(input)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Legal Q&A Chat</h1>
        <p className="text-muted-foreground">
          Ask questions about copyright laws and licensing
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-4"
        >
          <div className="space-y-4">
            {chatSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 