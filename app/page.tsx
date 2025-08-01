"use client"

import { useState, useEffect } from "react"
import { ResizablePanel } from "@/components/resizable-panel"
import { ProjectsSection } from "@/components/projects-section"
import { DocumentUploadSection } from "@/components/document-upload-section"
import { AIAssistantSection } from "@/components/ai-assistant-section"
import { DocumentContainer } from "@/components/document-container"
import { useAppState } from "@/hooks/use-app-state"
import { DownloadDropdown } from "@/components/download-dropdown"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image';

interface Section {
  section_id: string;
  status: string;
content:string
}

export default function DocumentManagementApp() {
  const { appState, initializeApp } = useAppState()
  const [leftPanelWidth, setLeftPanelWidth] = useState(60) // percentage

  const [SessionId, setSessionId] = useState<string>("");
  const handleSessionIdChange = (newSessionId: string) => {
    setSessionId(newSessionId)
    console.log('Session ID updated:',newSessionId);
  }

  //section ID
  const [sections, setSections] =  useState<Section>({
        section_id: "",
        status: "",
        content:""
  });
  const handleSectionChange = (newSections: Section) => {
    console.log('Updation',newSections);
    setSections(newSections)
    console.log('Sections updated:',newSections);
  }

  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Canara Logo */}
            <div className="flex items-center gap-2">
              <Image src="/CanaraHSBC_Logo-01.jpg" alt="Canara HSBC Logo" width={140} height={70} className="logo-negative-margin" />
            </div>
          </div>

          {/* Download Dropdown - moved to extreme right */}
          <div className="ml-auto">
            <DownloadDropdown />
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanel
          leftContent={<DocumentContainer 
            SessionId={SessionId}
            onSessionIdChange={handleSessionIdChange}
            sections={sections}
            onSectionsChange={handleSectionChange}
          />}
          rightContent={<RightPanel 
            SessionId={SessionId}
            onSessionIdChange={handleSessionIdChange}
            sections={sections}
            onSectionsChange={handleSectionChange}
            />}
          leftWidth={leftPanelWidth}
          onWidthChange={setLeftPanelWidth}
        />
      </div>
    </div>
  )
}

type RightPanelProps = {
  SessionId: string;
  onSessionIdChange: (newSessionId: string) => void;
  sections: Section;
  onSectionsChange: (newSections: Section) => void;
};

function RightPanel({ SessionId,onSessionIdChange,  sections, onSectionsChange}: RightPanelProps) {
  return (
    <Card className="h-full rounded-none border-r-0 border-t-0 border-b-0 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ProjectsSection 
          SessionId={SessionId}
          onSessionIdChange={onSessionIdChange}
        />
        <Separator />
        <DocumentUploadSection 
        SessionId={SessionId} 
        sections={sections}
        onSectionsChange={onSectionsChange}
        />
        <Separator />
        <AIAssistantSection />
      </div>
    </Card>
  )
}
