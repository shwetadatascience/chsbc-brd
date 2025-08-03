"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppState } from "@/hooks/use-app-state"
import { se } from "date-fns/locale"
import { editLLMPromptSection } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

interface Section {
  section_id: string;
  title?: string;
  content: string;
  status: string;
}

type AIAssistantProps = {
  SessionId: string;
  onSessionIdChange: (newSessionId: string) => void;
  sections: Section[];
  onSectionsChange: (newSections: Section[], source?: string) => void
};

export function AIAssistantSection({ SessionId, onSessionIdChange, sections, onSectionsChange }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedSection, setSelectedSection] = useState("")
  const { appState, sendChatMessage } = useAppState()
  const { toast } = useToast();

  //Chat messages state
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "system" }[]>([
    { text: "Hi there! I’m your AI-powered assistant for BRD creation. To get started, please generate your first section.", sender: "system" },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  //refering to dummy div to scroll to latest message 
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // const handleSendMessage = async () => {
  //   if (!message.trim() || !selectedSection) return

  //   await sendChatMessage(message, selectedSection)
  //   setMessage("")
  // }

  // Handles the chat box message, ensuring it is sent and displayed correctly.  
  // Messages can be manually entered by the user or auto-generated based on function events.
  const handleSend = () => {
    if (message?.trim()) {
      const newMessage: { text: string; sender: "user" | "system" } = { text: message, sender: "user" }; // Explicit type
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      //onSend(message);
      setMessage("");
    }
  };

  // Handles the chat box message,Example received message handler (simulating a response)
  const handleReceiveMessage = (response: string) => {
    const newMessage: { text: string; sender: "user" | "system" } = { text: response, sender: "system" }; // Explicit type
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }

  }, [scrollAreaRef]) //Corrected dependency

  //to scroll latest message in chat
  useEffect(() => {
    //console.log('chat sections', sections)
    if (messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTitle = (title: string) => {
    const parts = title.split('_');

    // Remove leading numeric prefix if it exists
    if (!isNaN(Number(parts[0]))) {
      parts.shift();
    }

    // If the next word is 1–2 characters and not meaningful, remove it too
    if (parts[0] && parts[0].length <= 2 && ['d', 'b', 'a', 'c', 'x', 'show'].includes(parts[0].toLowerCase())) {
      parts.shift();
    }

    // Capitalize and join
    return parts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSendMessage = async () => {
    if (!SessionId) {
      toast({
        title: "Warning",
        description: `Session ID is missing. Please try again later.`,
      });
      return;
    }

    if (!selectedSection) {
      toast({
        title: "Warning",
        description: `Please select a section to edit.`,
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Warning",
        description: `Message cannot be empty..`,
      });
      return;
    }

    try {
      handleSend();
      // Make your API call here
      const response = await editLLMPromptSection(selectedSection, message, SessionId);
      const { content, status, section_id } = response;

      const updatedSections = sections.map((section) =>
        section.section_id === selectedSection ? { ...section, content, status } : section
      );

      console.log('Updated Sections through LLM', updatedSections);
      onSectionsChange(updatedSections,"LLM Assistant");
      handleReceiveMessage(`Section ${formatTitle(section_id)} edited and saved successfully.`);
      // toast({
      //   title: "Section Edited Successfully through Assistant",
      //   description: `${formatTitle(response.section_id)} generated Successfully`,
      // });

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "LLM Generation Failed",
        description: `Could not generate section.`,
      });
    }
  };


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
            <Card className="bg-muted/30 bg-[#EAF5FD]">
              <ScrollArea ref={scrollAreaRef} className=" h-64 p-4 h-[350px] pr-4 overflow-y">
                <div className="space-y-3">
                  {/* Chat messages would be rendered here */}
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      {/* <Bot className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Start a conversation with the AI assistant</p> */}
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex items-center ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                          {msg.sender !== "user" && <div className="w-6 h-6 mr-2 rounded-full" style={{ background: '#F80061' }}></div>}
                          <div className={`p-3 m-2 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'bg-[#BFE4FF] text-black ml-auto' : 'bg-[#D5EBFB] text-black text-left'}`}>
                            {msg.text}
                          </div>
                          {msg.sender === "user" && <div className="w-6 h-6 ml-2 bg-[#00ADEF] rounded-full"></div>}
                        </div>
                      ))}
                      <div ref={bottomRef} />

                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>

            {/* Section Selection */}
            <div className="space-y-2">
              <Label htmlFor="section-select">Select Section to Edit</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection} >
                <SelectTrigger id="section-select" className="w-full bg-[#EAF5FD]">
                  <SelectValue placeholder="Choose a section to edit" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(sections) &&
                    sections
                      .filter(
                        (section) => section.status === 'generated' || section.status === 'edited'
                      )
                      .map((section) => (
                        <SelectItem key={section.section_id} value={section.section_id}>
                          {formatTitle(section.section_id)}
                        </SelectItem>
                      ))}

                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message-input">Message</Label>
              <div className="relative">
                <Textarea
                  id="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... Use @document to mention documents"
                  className="flex-1 min-h-[80px] resize-none pr-10" // add right padding for icon space
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !selectedSection}
                  className="absolute bottom-2 right-2 p-2 text-primary disabled:opacity-50"
                  type="button"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
