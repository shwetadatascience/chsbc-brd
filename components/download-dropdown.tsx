"use client"

import { useState } from "react"
import { ChevronDown, Download, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppState } from "@/hooks/use-app-state"

export function DownloadDropdown() {
  const { appState, downloadDocument } = useAppState()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (format: "pdf" | "word") => {
    if (!appState.template) {
      alert("No document available to download. Please upload a template first.")
      return
    }

    setIsDownloading(true)
    try {
      await downloadDocument(format)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Download failed. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-transparent"
          disabled={!appState.template || isDownloading}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? "Downloading..." : "Download"}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => handleDownload("pdf")}
          className="flex items-center gap-2 cursor-pointer"
          disabled={isDownloading}
        >
          <FileText className="w-4 h-4 text-red-500" />
          <span>Download as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload("word")}
          className="flex items-center gap-2 cursor-pointer"
          disabled={isDownloading}
        >
          <File className="w-4 h-4 text-blue-500" />
          <span>Download as Word</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
