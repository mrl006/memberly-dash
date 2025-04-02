
import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { 
  Bold, Italic, Link, List, ListOrdered, Code, AlignLeft, AlignCenter, AlignRight, 
  Image, Heading1, Heading2, Underline, Table, Square, FileCode, PanelRightOpen, 
  Type, Quote, CheckSquare, Minus, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
  const [textAreaRef, setTextAreaRef] = useState<HTMLTextAreaElement | null>(null);
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("Link text");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://");
  const [imageAlt, setImageAlt] = useState("Image description");
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  
  useEffect(() => {
    setEditorValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditorValue(newValue);
    onChange(newValue);
  };
  
  const getLineNumbers = () => {
    const lines = editorValue.split('\n');
    return Array.from({ length: Math.max(lines.length, 10) }, (_, i) => i + 1).join('\n');
  };

  const insertAtCursor = (textToInsert: string, wrapSelection: boolean = false, prefix = '', suffix = '') => {
    if (!textAreaRef) return;
    
    const start = textAreaRef.selectionStart;
    const end = textAreaRef.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    const newText = wrapSelection 
      ? editorValue.substring(0, start) + prefix + selectedText + suffix + editorValue.substring(end)
      : editorValue.substring(0, start) + textToInsert + editorValue.substring(end);
    
    setEditorValue(newText);
    onChange(newText);
    
    // Return focus to the textarea
    setTimeout(() => {
      if (textAreaRef) {
        textAreaRef.focus();
        if (wrapSelection) {
          textAreaRef.setSelectionRange(start + prefix.length, end + prefix.length);
        } else {
          textAreaRef.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }
      }
    }, 0);
  };

  const handleInsertLink = () => {
    const linkHtml = `<a href="${linkUrl}" title="${linkText}">${linkText}</a>`;
    insertAtCursor(linkHtml);
    setLinkDialogOpen(false);
    setLinkUrl("https://");
    setLinkText("Link text");
  };

  const handleInsertImage = () => {
    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" width="100%" />`;
    insertAtCursor(imageHtml);
    setImageDialogOpen(false);
    setImageUrl("https://");
    setImageAlt("Image description");
  };

  const handleInsertTable = () => {
    let tableHtml = '<table class="w-full border-collapse border border-gray-300">\n';
    tableHtml += '  <thead>\n    <tr>\n';
    
    // Add header cells
    for (let i = 0; i < tableCols; i++) {
      tableHtml += '      <th class="border border-gray-300 p-2">Header ' + (i + 1) + '</th>\n';
    }
    
    tableHtml += '    </tr>\n  </thead>\n  <tbody>\n';
    
    // Add rows
    for (let i = 0; i < tableRows; i++) {
      tableHtml += '    <tr>\n';
      
      // Add cells
      for (let j = 0; j < tableCols; j++) {
        tableHtml += '      <td class="border border-gray-300 p-2">Cell ' + (i + 1) + '-' + (j + 1) + '</td>\n';
      }
      
      tableHtml += '    </tr>\n';
    }
    
    tableHtml += '  </tbody>\n</table>';
    
    insertAtCursor(tableHtml);
    setTableDialogOpen(false);
    setTableRows(3);
    setTableCols(3);
  };

  const textFormattingCommands = [
    { 
      icon: <Bold size={16} />, 
      tooltip: "Bold Text", 
      action: () => insertAtCursor('', true, '<strong>', '</strong>') 
    },
    { 
      icon: <Italic size={16} />, 
      tooltip: "Italic Text", 
      action: () => insertAtCursor('', true, '<em>', '</em>') 
    },
    { 
      icon: <Underline size={16} />, 
      tooltip: "Underline Text", 
      action: () => insertAtCursor('', true, '<u>', '</u>') 
    },
    { 
      icon: <Type size={16} />, 
      tooltip: "Span Element", 
      action: () => insertAtCursor('', true, '<span>', '</span>') 
    },
  ];

  const headingCommands = [
    { 
      icon: <Heading1 size={16} />, 
      tooltip: "Heading 1", 
      action: () => insertAtCursor('', true, '<h1>', '</h1>') 
    },
    { 
      icon: <Heading2 size={16} />, 
      tooltip: "Heading 2", 
      action: () => insertAtCursor('', true, '<h2>', '</h2>') 
    },
    { 
      icon: <Type size={16} />, 
      tooltip: "Paragraph", 
      action: () => insertAtCursor('', true, '<p>', '</p>') 
    },
    { 
      icon: <Quote size={16} />, 
      tooltip: "Blockquote", 
      action: () => insertAtCursor('', true, '<blockquote>', '</blockquote>') 
    },
  ];

  const alignmentCommands = [
    { 
      icon: <AlignLeft size={16} />, 
      tooltip: "Align Left", 
      action: () => insertAtCursor('', true, '<div style="text-align: left;">', '</div>') 
    },
    { 
      icon: <AlignCenter size={16} />, 
      tooltip: "Align Center", 
      action: () => insertAtCursor('', true, '<div style="text-align: center;">', '</div>') 
    },
    { 
      icon: <AlignRight size={16} />, 
      tooltip: "Align Right", 
      action: () => insertAtCursor('', true, '<div style="text-align: right;">', '</div>') 
    },
  ];

  const listCommands = [
    { 
      icon: <List size={16} />, 
      tooltip: "Unordered List", 
      action: () => insertAtCursor('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>') 
    },
    { 
      icon: <ListOrdered size={16} />, 
      tooltip: "Ordered List", 
      action: () => insertAtCursor('<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>') 
    },
    { 
      icon: <CheckSquare size={16} />, 
      tooltip: "Checkbox List", 
      action: () => insertAtCursor('<ul class="checklist">\n  <li><input type="checkbox" id="item1"> <label for="item1">Item 1</label></li>\n  <li><input type="checkbox" id="item2"> <label for="item2">Item 2</label></li>\n</ul>') 
    },
  ];

  const insertCommands = [
    { 
      icon: <Link size={16} />, 
      tooltip: "Insert Link", 
      action: () => setLinkDialogOpen(true)
    },
    { 
      icon: <Image size={16} />, 
      tooltip: "Insert Image", 
      action: () => setImageDialogOpen(true)
    },
    { 
      icon: <Table size={16} />, 
      tooltip: "Insert Table", 
      action: () => setTableDialogOpen(true)
    },
    { 
      icon: <Minus size={16} />, 
      tooltip: "Horizontal Rule", 
      action: () => insertAtCursor('<hr />') 
    },
  ];

  const codeCommands = [
    { 
      icon: <Code size={16} />, 
      tooltip: "Code Block", 
      action: () => insertAtCursor('', true, '<pre><code>', '</code></pre>') 
    },
    { 
      icon: <FileCode size={16} />, 
      tooltip: "Inline Code", 
      action: () => insertAtCursor('', true, '<code>', '</code>') 
    },
  ];

  const containerCommands = [
    { 
      icon: <Square size={16} />, 
      tooltip: "Div Container", 
      action: () => insertAtCursor('', true, '<div>', '</div>') 
    },
    { 
      icon: <Palette size={16} />, 
      tooltip: "Styled Container", 
      action: () => insertAtCursor('', true, '<div class="container" style="padding: 20px; border: 1px solid #ddd; border-radius: 4px;">', '</div>') 
    },
  ];

  const viewCommands = [
    { 
      icon: <PanelRightOpen size={16} />, 
      tooltip: viewMode === "code" ? "Preview" : "Edit Code", 
      action: () => setViewMode(viewMode === "code" ? "preview" : "code")
    },
  ];

  const allCommandGroups = [
    { name: "Text", commands: textFormattingCommands },
    { name: "Headings", commands: headingCommands },
    { name: "Alignment", commands: alignmentCommands },
    { name: "Lists", commands: listCommands },
    { name: "Insert", commands: insertCommands },
    { name: "Code", commands: codeCommands },
    { name: "Containers", commands: containerCommands },
    { name: "View", commands: viewCommands },
  ];
  
  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <Label className="text-sm font-medium text-blue-500">
          HTML Editor
        </Label>
        
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            {allCommandGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex items-center">
                {groupIndex > 0 && <div className="mx-1 h-6 w-px bg-gray-300"></div>}
                {group.commands.map((command, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={command.action}
                        className="h-8 w-8 p-0"
                      >
                        {command.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{command.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </TooltipProvider>
        </div>
      </div>
      
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Add a hyperlink to your content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="link-text" className="text-right">
                Link Text
              </UILabel>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="link-url" className="text-right">
                URL
              </UILabel>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInsertLink}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Add an image to your content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="image-url" className="text-right">
                Image URL
              </UILabel>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="image-alt" className="text-right">
                Alt Text
              </UILabel>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInsertImage}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
            <DialogDescription>Add a table to your content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="table-rows" className="text-right">
                Rows
              </UILabel>
              <Input
                id="table-rows"
                type="number"
                min="1"
                max="10"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <UILabel htmlFor="table-cols" className="text-right">
                Columns
              </UILabel>
              <Input
                id="table-cols"
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setTableDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInsertTable}>
              Insert Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {viewMode === "preview" ? (
        <div className="p-4 bg-white overflow-auto min-h-[300px]">
          <div dangerouslySetInnerHTML={{ __html: editorValue }} />
        </div>
      ) : (
        <div className="relative flex">
          <div className="w-12 py-2 pr-2 text-right text-gray-500 bg-gray-50 select-none font-mono text-xs overflow-hidden text-overflow-clip whitespace-pre">
            {getLineNumbers()}
          </div>
          
          <textarea
            ref={setTextAreaRef}
            value={editorValue}
            onChange={handleChange}
            className="flex-1 p-2 font-mono text-sm resize-none focus:outline-none min-h-[300px] w-full border-none font-family-monospace"
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
