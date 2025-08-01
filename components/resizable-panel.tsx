"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ResizablePanelProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  leftWidth: number
  onWidthChange: (width: number) => void
  minLeftWidth?: number
  maxLeftWidth?: number
  minRightWidth?: number
}

export function ResizablePanel({
  leftContent,
  rightContent,
  leftWidth,
  onWidthChange,
  minLeftWidth = 30,
  maxLeftWidth = 80,
  minRightWidth = 20,
}: ResizablePanelProps) {
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Apply constraints
      const constrainedWidth = Math.max(
        minLeftWidth,
        Math.min(maxLeftWidth, Math.min(newLeftWidth, 100 - minRightWidth)),
      )

      onWidthChange(constrainedWidth)
    },
    [isResizing, minLeftWidth, maxLeftWidth, minRightWidth, onWidthChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel */}
      <Card
        className="rounded-none border-r-0 border-t-0 border-b-0 overflow-hidden flex-shrink-0 bg-muted/30"
        style={{ width: `${leftWidth}%` }}
      >
        {leftContent}
      </Card>

      {/* Resizable Divider */}
      <div
        className={cn(
          "w-2 bg-border hover:bg-muted-foreground/20 cursor-col-resize transition-colors flex-shrink-0 relative group",
          isResizing && "bg-muted-foreground/20",
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-8 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 transition-colors" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="overflow-hidden flex-1" style={{ width: `${100 - leftWidth}%` }}>
        {rightContent}
      </div>
    </div>
  )
}
