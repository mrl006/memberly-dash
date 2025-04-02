
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, File, FileText, Video, Image, Music, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock download data
const downloadItems = [
  { 
    id: 1, 
    name: "Getting Started Guide.pdf", 
    type: "PDF", 
    size: "3.2 MB", 
    dateAdded: "2023-08-10",
    category: "Guides" 
  },
  { 
    id: 2, 
    name: "Membership Tutorial.mp4", 
    type: "Video", 
    size: "45.8 MB", 
    dateAdded: "2023-08-05",
    category: "Tutorials" 
  },
  { 
    id: 3, 
    name: "Resource Pack.zip", 
    type: "Archive", 
    size: "12.4 MB", 
    dateAdded: "2023-08-01",
    category: "Resources" 
  },
  { 
    id: 4, 
    name: "Invoice Template.xlsx", 
    type: "Spreadsheet", 
    size: "1.8 MB", 
    dateAdded: "2023-07-25",
    category: "Templates" 
  },
  { 
    id: 5, 
    name: "Branding Guidelines.pdf", 
    type: "PDF", 
    size: "5.1 MB", 
    dateAdded: "2023-07-20",
    category: "Guides" 
  },
  { 
    id: 6, 
    name: "Advanced Features.mp4", 
    type: "Video", 
    size: "68.3 MB", 
    dateAdded: "2023-07-15",
    category: "Tutorials" 
  },
];

const fileTypeIcons = {
  PDF: FileText,
  Video: Video,
  Spreadsheet: File,
  Archive: File,
  Image: Image,
  Audio: Music,
};

const Downloads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter downloads based on search term and active tab
  const filteredDownloads = downloadItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || item.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  // Get unique categories for tabs
  const categories = ["All", ...new Set(downloadItems.map(item => item.category))];

  // Get file icon based on file type
  const getFileIcon = (type) => {
    const IconComponent = fileTypeIcons[type] || File;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Downloads</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>
            Access and download your purchased files and resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category.toLowerCase()} value={category.toLowerCase()}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDownloads.length > 0 ? (
                      filteredDownloads.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium flex items-center">
                            {getFileIcon(file.type)}
                            <span className="ml-2">{file.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{file.type}</Badge>
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{file.dateAdded}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No files found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredDownloads.length} of {downloadItems.length} files
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Downloads;
