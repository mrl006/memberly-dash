
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ language, value, onChange }: CodeEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
  
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
  
  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <Label className={`text-sm font-medium ${getSyntaxHighlightClass()}`}>
          {language.toUpperCase()}
        </Label>
      </div>
      
      <div className="relative flex">
        <div className="w-12 py-2 pr-2 text-right text-gray-500 bg-gray-50 select-none font-mono text-xs overflow-hidden text-overflow-clip whitespace-pre">
          {getLineNumbers()}
        </div>
        
        <textarea
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
