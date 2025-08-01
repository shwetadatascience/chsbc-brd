"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ChevronDown, ChevronUp, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"

export function DocumentUploadSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { appState, uploadTemplate, uploadReference, uploadSupporting } = useAppState()

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

  const handleSupportingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await uploadSupporting(files[i])
      }
    }
  }

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
                <Label className="text-base font-medium">Product Specs and Other Supporting Documents</Label>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  ref={supportingFileRef}
                  type="file"
                  onChange={handleSupportingUpload}
                  multiple
                  className="flex-1"
                  accept=".pdf,.doc,.docx"
                />
                <Button onClick={() => supportingFileRef.current?.click()} size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Supporting
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
