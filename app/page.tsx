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

export default function DocumentManagementApp() {
  const { appState, initializeApp } = useAppState()
  const [leftPanelWidth, setLeftPanelWidth] = useState(60) // percentage

  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Canara Logo */}
            <div className="flex items-center gap-2">
              <img src="/placeholder.svg?height=32&width=120&text=Canara+Bank" alt="Canara Bank" className="h-8" />
            </div>

            {/* HSBC Logo */}
            <div className="flex items-center gap-2">
              <img src="/placeholder.svg?height=32&width=80&text=HSBC" alt="HSBC" className="h-8" />
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
          leftContent={<DocumentContainer />}
          rightContent={<RightPanel />}
          leftWidth={leftPanelWidth}
          onWidthChange={setLeftPanelWidth}
        />
      </div>
    </div>
  )
}

function RightPanel() {
  return (
    <Card className="h-full rounded-none border-r-0 border-t-0 border-b-0 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ProjectsSection />
        <Separator />
        <DocumentUploadSection />
        <Separator />
        <AIAssistantSection />
      </div>
    </Card>
  )
}
