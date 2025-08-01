"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppState } from "@/hooks/use-app-state"

export function AIAssistantSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const { appState, sendChatMessage } = useAppState()

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSection) return

    await sendChatMessage(message, selectedSection)
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="rounded-none border-x-0 border-t-0 border-b-0">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">AI Assistant</h3>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Chat Messages Area */}
            <Card className="bg-muted/30">
              <ScrollArea className="h-64 p-4">
                <div className="space-y-3">
                  {/* Chat messages would be rendered here */}
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <Bot className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Start a conversation with the AI assistant</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>

            {/* Section Selection */}
            <div className="space-y-2">
              <Label htmlFor="section-select">Select Section to Edit</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger id="section-select">
                  <SelectValue placeholder="Choose a section to edit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="section1">Introduction</SelectItem>
                  <SelectItem value="section2">Requirements</SelectItem>
                  <SelectItem value="section3">Specifications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message-input">Message</Label>
              <div className="flex gap-2">
                <Textarea
                  id="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... Use @document to mention documents"
                  className="flex-1 min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !selectedSection}
                  size="sm"
                  className="self-end gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
