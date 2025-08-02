"use client"

import { useState, useEffect } from "react"
import { ResizablePanel } from "@/components/resizable-panel"
import { ProjectsSection } from "@/components/projects-section"
import { DocumentUploadSection } from "@/components/document-upload-section"
import { AIAssistantSection } from "@/components/ai-assistant-section"
import { DocumentContainer } from "@/components/document-container"
import { useAppState } from "@/hooks/use-app-state"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { downloadPdfDocument, downloadWordDocument } from "@/services/userService";
interface Section {
  section_id: string;
  status: string;
  content:string
}

export default function DocumentManagementApp() {
  const { appState, initializeApp } = useAppState()
  const [leftPanelWidth, setLeftPanelWidth] = useState(60) // percentage
  const { toast } = useToast();

  const [SessionId, setSessionId] = useState<string>("");
  const handleSessionIdChange = (newSessionId: string) => {
    setSessionId(newSessionId)
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

  //function to download files
    const handleDownload = async (type: "pdf" | "word") => {
    try {
      const blob =
        type === "pdf"
          ? await downloadPdfDocument(SessionId)
          : await downloadWordDocument(SessionId);

      const contentType =
        type === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const filename = `final-document.${type === "pdf" ? "pdf" : "docx"}`;
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: contentType }));

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      toast({
        title: `Download Started`,
        description: `Your ${type.toUpperCase()} document is downloading.`,
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: `Could not download ${type.toUpperCase()} document.`,
        variant: "destructive",
      });
    }
  };

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
            <h1 className="font-semibold text-xl">CHSBC BRD Generator</h1>
          </div>

          {/* Download Dropdown - moved to extreme right */}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                  PDF
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => handleDownload("word")}>
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
