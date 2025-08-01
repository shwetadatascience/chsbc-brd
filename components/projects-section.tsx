"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAppState } from "@/hooks/use-app-state"
import { createSession } from '@/services/userService';
import { useToast } from "@/components/ui/use-toast";

type ProjectsSectionProps = {
  SessionId: string;
  onSessionIdChange: (newSessionId: string) => void;
};


export function ProjectsSection({ SessionId,onSessionIdChange }: ProjectsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { appState, createNewProject } = useAppState()
  const { toast } = useToast();

  const handleCreateSession = async () => {
    try {
      const result = await createSession(); // This is the service function
      console.log('Session created:', result);
      onSessionIdChange(result.session_id)
       toast({
        title: "Project Created",
        description: `Project ID: ${result.session_id|| "unknown"}`,
      });
      console.log("Creating toast...");
toast({ title: "Test", description: "Toast check" });
    } catch (error) {
      console.error('Session creation failed:', error);
    }
  };

  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Projects</h3>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Project ID:</span>
                {SessionId ? (
                  <Badge variant="secondary">{SessionId}</Badge>
                ) : (
                  <Badge variant="outline">Not Created</Badge>
                )}
              </div>
              <Button onClick={handleCreateSession} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>

            {/* Project List would go here */}
            <div className="space-y-2">{/* This would be populated with actual projects */}</div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
