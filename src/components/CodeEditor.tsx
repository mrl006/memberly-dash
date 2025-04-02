
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Link, List, ListOrdered, Code, AlignLeft, AlignCenter, AlignRight, Image, Heading1, Heading2, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ language, value, onChange }: CodeEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
  const [textAreaRef, setTextAreaRef] = useState<HTMLTextAreaElement | null>(null);
  
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
  
  const getSyntaxHighlightClass = () => {
    switch (language) {
      case "html":
        return "text-blue-500";
      case "css":
        return "text-purple-500";
      case "javascript":
        return "text-amber-500";
      default:
        return "";
    }
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

  // HTML editing commands
  const commands = language === "html" ? [
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
      icon: <Link size={16} />, 
      tooltip: "Insert Link", 
      action: () => insertAtCursor('', true, '<a href="#">', '</a>') 
    },
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
      icon: <Image size={16} />, 
      tooltip: "Insert Image", 
      action: () => insertAtCursor('<img src="" alt="" width="100%" />') 
    },
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
    { 
      icon: <Code size={16} />, 
      tooltip: "Code Block", 
      action: () => insertAtCursor('', true, '<pre><code>', '</code></pre>') 
    },
  ] : [];
  
  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <Label className={`text-sm font-medium ${getSyntaxHighlightClass()}`}>
          {language.toUpperCase()}
        </Label>
        
        {language === "html" && (
          <div className="flex gap-1">
            <TooltipProvider>
              {commands.map((command, index) => (
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
            </TooltipProvider>
          </div>
        )}
      </div>
      
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
    </div>
  );
};

export default CodeEditor;
