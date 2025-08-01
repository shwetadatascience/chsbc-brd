"use client"

import { Edit, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppState } from "@/hooks/use-app-state"

export function DocumentContainer() {
  const { appState } = useAppState()

  if (!appState.template) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-muted/30">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl">Upload Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">BRD Template Document</p>
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Sample BRD Document</p>
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Product Specs and Supporting Documents</p>
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {appState.template.sections?.map((section) => (
          <Card key={section.id} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <Button size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {section.content ? (
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No content yet. Click Edit to add content.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
