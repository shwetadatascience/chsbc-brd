"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateIndividualSection,editManualSection } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { MDXEditorMethods } from '@mdxeditor/editor';
import { Loader2 } from "lucide-react";
import {
  MDXEditor, headingsPlugin,
  listsPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo,
  BoldItalicUnderlineToggles, diffSourcePlugin,
  tablePlugin,
  InsertTable,
  DiffSourceToggleWrapper,
  linkPlugin,
  InsertFrontmatter,
  ListsToggle
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';



interface Section {
  section_id: string;
  title?: string;
  content: string;
  status: string;
}

type DocumentContainerProps = {
  SessionId: string;
  onSessionIdChange: (newSessionId: string) => void;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
};

export function DocumentContainer({ SessionId, onSessionIdChange, sections, onSectionsChange }: DocumentContainerProps) {
  const [localSections, setLocalSections] = useState<Section[]>(sections);
  const editorRefs = useRef<Record<string, MDXEditorMethods | null>>({});
  const { toast } = useToast();
  const [loadingSections, setLoadingSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);


  const formatTitle = (title: string) => {
    const parts = title.split('_');

    // Remove leading numeric prefix if it exists
    if (!isNaN(Number(parts[0]))) {
      parts.shift();
    }

    // If the next word is 1–2 characters and not meaningful, remove it too
    if (parts[0] && parts[0].length <= 2 && ['d', 'b', 'a', 'c', 'x', 'show'].includes(parts[0].toLowerCase())) {
      parts.shift();
    }

    // Capitalize and join
    return parts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  const handleContentChange = (sectionId: string, content: string) => {
    const updated = localSections.map((s) =>
      s.section_id === sectionId ? { ...s, content } : s
    );
    setLocalSections(updated);
    onSectionsChange(updated);
  };

  const handleEdit = async (sectionId: string) => {
    if (!SessionId) return;

    setLoadingSections(prev => ({ ...prev, [sectionId]: true }));

    try {
      const matchedSection = localSections.find((s) => s.section_id === sectionId);
      const Sectioncontent = matchedSection?.content || "";

      const response = await editManualSection(sectionId,Sectioncontent);

      const { content, status, section_id } = response;

      console.log('Edit Content', response);

      // Update content in editor
      const editorInstance = editorRefs.current[sectionId];
      if (editorInstance) {
        editorInstance.setMarkdown(content || '');
      }

      // Update content in local state and propagate to parent

      const updatedSections = localSections.map((section) =>
        section.section_id === sectionId ? { ...section, content, status } : section
      );

      console.log('Updated Sections', updatedSections);

      setLocalSections(updatedSections);
      onSectionsChange(updatedSections);

      toast({
        title: "Section Generated",
        description: `${formatTitle(response.section_id)} generated Successfully`,
      });

      // Optional: toast.success('Section generated successfully');
    } catch (error) {
      console.error('Error generating section:', error);
      // Optional: toast.error('Failed to generate section');
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: `Could not generate section.`,
      });
    }
    finally {
      setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleGenerate = async (sectionId: string) => {
    if (!SessionId) return;

    setLoadingSections(prev => ({ ...prev, [sectionId]: true }));

    try {
      const response = await generateIndividualSection(sectionId, SessionId);

      const { content, status, section_id } = response;

      console.log('Content', response);

      // Update content in editor
      const editorInstance = editorRefs.current[sectionId];
      if (editorInstance) {
        editorInstance.setMarkdown(content || '');
      }

      // Update content in local state and propagate to parent

      const updatedSections = localSections.map((section) =>
        section.section_id === sectionId ? { ...section, content, status } : section
      );

      console.log('Updated Sections', updatedSections);

      setLocalSections(updatedSections);
      onSectionsChange(updatedSections);

      toast({
        title: "Section Generated",
        description: `${formatTitle(response.section_id)} generated Successfully`,
      });

      // Optional: toast.success('Section generated successfully');
    } catch (error) {
      console.error('Error generating section:', error);
      // Optional: toast.error('Failed to generate section');
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: `Could not generate section.`,
      });
    }
    finally {
      setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };



  if (!localSections.length) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-muted/30">
        <Card className="max-w-md">
          <CardHeader className="text-center pt-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl -mb-6">Upload Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 pb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Product Specs and Supporting Documents</p>
                  {/* <Badge variant="destructive" className="text-xs">Required</Badge> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {localSections.map((section) => (
          <Card key={section.section_id} className="shadow-sm bg-[#EAF5FD] border-none">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center gap-6">
                  <CardTitle className="text-lg">{formatTitle(section.section_id)}</CardTitle>
                  <Button
                    size="sm"
                    className="cursor-pointer"
                      onClick={() =>
                        section.status === "generated"
                          ? handleEdit(section.section_id)
                          : handleGenerate(section.section_id)
                      }
                  >
                    {loadingSections[section.section_id] ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Generating...
                      </>
                    ) : (
                      (section.status === 'generated' || section.status === 'edited') && section.content != "" ? (
                        "Save Section"
                      ) : (
                        "Generate Section"
                      )

                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>

              <MDXEditor
                className="dark-theme dark-editor mdx-editor"
                markdown={section.content || ""}
                ref={(ref) => { editorRefs.current[section.section_id] = ref; }}
                onChange={(val) => handleContentChange(section.section_id, val)}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  linkPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  //markdownShortcutPlugin(),
                  tablePlugin(),
                  //frontmatterPlugin(),
                  //directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                  diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        {' '}
                        <DiffSourceToggleWrapper>
                          <UndoRedo />
                        </DiffSourceToggleWrapper>
                        <BoldItalicUnderlineToggles />
                        <InsertTable />
                        <ListsToggle />
                        <InsertFrontmatter />
                      </>
                    )
                  }),

                ]}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
