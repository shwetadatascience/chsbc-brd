"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAppState } from "@/hooks/use-app-state"
import { createSession } from '@/services/userService';
import { useToast } from "@/hooks/use-toast";

type ProjectsSectionProps = {
  SessionId: string;
  onSessionIdChange: (newSessionId: string) => void;
};


export function ProjectsSection({ SessionId, onSessionIdChange }: ProjectsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { appState, createNewProject } = useAppState()
  const [projectCreated, setProjectCreated] = useState(false); // badge state
  const { toast } = useToast();

  const handleCreateSession = async () => {

    try {
      setProjectCreated(true); // Set badge state to true
      const result = await createSession(); // This is the service function
      if (result.session_id != '') {
        setProjectCreated(false);
      }

      onSessionIdChange(result.session_id)
      toast({
        title: "Project Created",
        description: `Project ID: ${result.session_id || "unknown"}`,
        duration: 4000,
      });
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
              <Button onClick={handleCreateSession} size="sm" className="gap-2 cursor-pointer">
                {projectCreated ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    New Project
                  </>

                )}

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
