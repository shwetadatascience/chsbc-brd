"use client"

import { useState, useCallback } from "react"
import { apiClient, API_CONFIG } from "@/lib/api-config"

interface AppState {
  projectId: string | null
  template: any | null
  referenceDocument: any | null
  supportingDocuments: any[]
  currentEditingSection: string | null
}

const initialState: AppState = {
  projectId: null,
  template: null,
  referenceDocument: null,
  supportingDocuments: [],
  currentEditingSection: null,
}

export function useAppState() {
  const [appState, setAppState] = useState<AppState>(initialState)
  const [loading, setLoading] = useState(false)

  const initializeApp = useCallback(async () => {
    setLoading(true)
    try {
      // Check for existing project in sessionStorage
      const savedProjectId = sessionStorage.getItem("projectId")

      if (savedProjectId) {
        setAppState((prev) => ({ ...prev, projectId: savedProjectId }))
        // Load project data here
      } else {
        // Create new project
        const newProjectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem("projectId", newProjectId)
        setAppState((prev) => ({ ...prev, projectId: newProjectId }))
      }
    } catch (error) {
      console.error("Error initializing app:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const createNewProject = useCallback(async () => {
    if (confirm("Are you sure you want to create a new project? This will clear all current data.")) {
      sessionStorage.removeItem("projectId")
      setAppState(initialState)
      await initializeApp()
    }
  }, [initializeApp])

  const uploadTemplate = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const response = await apiClient.uploadFile(API_CONFIG.ENDPOINTS.UPLOAD_TEMPLATE, file)
      setAppState((prev) => ({ ...prev, template: response }))
    } catch (error) {
      console.error("Error uploading template:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadReference = useCallback(async (file: File) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockReference = {
        name: file.name,
        id: `ref_${Date.now()}`,
      }

      setAppState((prev) => ({ ...prev, referenceDocument: mockReference }))
    } catch (error) {
      console.error("Error uploading reference:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadSupporting = useCallback(async (file: File) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockSupporting = {
        name: file.name,
        id: `sup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      setAppState((prev) => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, mockSupporting],
      }))
    } catch (error) {
      console.error("Error uploading supporting document:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const sendChatMessage = useCallback(async (message: string, sectionId: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response - in real app, this would update the section content
      console.log("Chat message sent:", { message, sectionId })
    } catch (error) {
      console.error("Error sending chat message:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadDocument = useCallback(
    async (format: "pdf" | "word") => {
      if (!appState.template) {
        throw new Error("No template available")
      }

      setLoading(true)
      try {
        // Simulate API call for document generation
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Create a mock document content
        const documentContent = generateDocumentContent(appState.template)

        if (format === "pdf") {
          // For PDF generation, we'll create an HTML version and trigger print
          const printWindow = window.open("", "_blank")
          if (printWindow) {
            printWindow.document.write(generatePrintableHTML(documentContent))
            printWindow.document.close()
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        } else if (format === "word") {
          // For Word format, create a downloadable blob
          const blob = new Blob([generateWordContent(documentContent)], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `document_${appState.projectId?.substring(0, 8)}.docx`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error("Error downloading document:", error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [appState.template, appState.projectId],
  )

  // Helper function to generate document content
  const generateDocumentContent = (template: any) => {
    return (
      template.sections?.map((section: any) => ({
        title: section.title,
        content: section.content || "No content provided.",
      })) || []
    )
  }

  // Helper function to generate printable HTML
  const generatePrintableHTML = (sections: any[]) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Legal Document</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 40px; 
            color: #333;
          }
          h1 { 
            color: #333; 
            border-bottom: 2px solid #333; 
            padding-bottom: 10px; 
            margin-bottom: 30px;
          }
          h2 { 
            color: #555; 
            margin-top: 30px; 
            margin-bottom: 15px; 
            font-size: 1.5em;
          }
          p { 
            margin-bottom: 15px; 
            text-align: justify; 
          }
          .section { 
            margin-bottom: 40px; 
            page-break-inside: avoid; 
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
          @media print {
            body { margin: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Business Requirements Document</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        ${sections
          .map(
            (section) => `
          <div class="section">
            <h2>${section.title}</h2>
            <div>${section.content}</div>
          </div>
        `,
          )
          .join("")}
        <div class="footer">
          <p>Document generated by Canara HSBC Life Insurance</p>
        </div>
      </body>
      </html>
    `
  }

  // Helper function to generate Word content (simplified HTML format)
  const generateWordContent = (sections: any[]) => {
    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Business Requirements Document</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; margin-bottom: 15px; }
          p { margin-bottom: 15px; }
          .section { margin-bottom: 40px; }
        </style>
      </head>
      <body>
        <h1>Business Requirements Document</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        ${sections
          .map(
            (section) => `
          <div class="section">
            <h2>${section.title}</h2>
            <div>${section.content}</div>
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `
  }

  return {
    appState,
    loading,
    initializeApp,
    createNewProject,
    uploadTemplate,
    uploadReference,
    uploadSupporting,
    sendChatMessage,
    downloadDocument,
  }
}
