"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ChevronDown, ChevronUp, Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"
import { useToast } from "@/hooks/use-toast";
import { uploadProductSpecsFile, getInitialOutline } from "@/services/userService";

interface Section {
  section_id: string;
  status: string;
  content: string
}

type DocumentUploadProps = {
  SessionId: string;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;

};

export function DocumentUploadSection({ SessionId, sections, onSectionsChange }: DocumentUploadProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { appState, uploadTemplate, uploadReference, uploadSupporting } = useAppState()
  const [fileUploaded, setFileUploaded] = useState(false); // badge state
  const [isFetchingOutline, setIsFetchingOutline] = useState(false); // loading spinner
  const [fileLoaded, setFileLoaded] = useState(false); // badge state
  const { toast } = useToast();

  const templateFileRef = useRef<HTMLInputElement>(null)
  const referenceFileRef = useRef<HTMLInputElement>(null)
  const supportingFileRef = useRef<HTMLInputElement>(null)

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadTemplate(file)
    }
  }

  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadReference(file)
    }
  }
  const allowedExtensions = [".md", ".txt", ".docx", ".xls", ".xlsx"];
  const handleSupportingSpecsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      toast({
        title: "Invalid File",
        description: "Only .docx, .xls, .xlsx, .txt, and .md files are allowed.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Create session
      const sessionId = SessionId;
      setFileLoaded(true);
      // 2. Upload file
      const response = await uploadProductSpecsFile(file, sessionId);
      setFileUploaded(true);
      if (response) {
        setFileLoaded(false);
      }
      // 3. Show success toast
      toast({
        title: "File Uploaded Successfully",
        description: `Session ID: ${sessionId}`,
        variant: "success",
      });

      // 4. Show fetching toast with spinner
      setIsFetchingOutline(true);
      toast({
        title: "Fetching Outline Now...",
        description: "Hang tight while we process your document.",
        icon: <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />,
      });

      // 5. Slight delay then fetch outline
      setTimeout(async () => {
        try {
          const outline = await getInitialOutline(sessionId);
          onSectionsChange(outline);
          //console.log("Outline:", outline);
          // handle outline (store or render)
        } catch (err) {
          toast({
            title: "Outline Fetch Failed",
            description: "Unable to retrieve outline.",
            variant: "destructive",
          });
        } finally {
          setIsFetchingOutline(false);
        }
      }, 100);
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Something went wrong during upload.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Document Upload</h3>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* BRD Template Document */}
            {/* <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">BRD Template Document</Label>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  ref={templateFileRef}
                  type="file"
                  onChange={handleTemplateUpload}
                  className="flex-1"
                  accept=".pdf,.doc,.docx"
                />
                <Button onClick={() => templateFileRef.current?.click()} size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Template
                </Button>
              </div>
            </div> */}

            {/* Sample BRD Document */}
            {/* <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Sample BRD Document</Label>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  ref={referenceFileRef}
                  type="file"
                  onChange={handleReferenceUpload}
                  className="flex-1"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select from backend reference documents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sample1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Sample Document 1
                    </div>
                  </SelectItem>
                  <SelectItem value="sample2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Sample Document 2
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Use Selected Reference
                </Button>
                <Button onClick={() => referenceFileRef.current?.click()} size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Reference
                </Button>
              </div>
            </div> */}

            {/* Product Specs and Supporting Documents */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Product Specs Documents</Label>
                <Badge
                  variant={fileUploaded ? "default" : "destructive"}
                  className={fileUploaded ? "bg-green-500 text-white" : ""}
                >
                  {fileUploaded ? "Uploaded" : "Required"}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  ref={supportingFileRef}
                  type="file"
                  onChange={handleSupportingSpecsUpload}
                  multiple
                  className="flex-1"
                  accept=".docx,.txt,.xls,.xlsx,.md"
                />
                <Button onClick={() => supportingFileRef.current?.click()} size="sm" className="gap-2 cursor-pointer">
                  {fileLoaded ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload File
                    </>

                  )}
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Expected file types: <code>.docx</code>, <code>.xls</code>, <code>.xlsx</code>, <code>.txt</code>, <code>.md</code>
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
