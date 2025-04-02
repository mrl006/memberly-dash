import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Video } from "lucide-react";

// Mock download data - keeping only video files
const downloadItems = [
  { 
    id: 2, 
    name: "Membership Tutorial.mp4", 
    type: "Video", 
    size: "45.8 MB", 
    dateAdded: "2023-08-05",
  },
  { 
    id: 6, 
    name: "Advanced Features.mp4", 
    type: "Video", 
    size: "68.3 MB", 
    dateAdded: "2023-07-15",
  },
];

const Downloads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter downloads based on search term
  const filteredDownloads = downloadItems.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handlePlayVideo = (file) => {
    setSelectedVideo(file);
    setShowVideoPlayer(true);
  };

  const handleCloseVideo = () => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);
  };

  const handleDownloadExtension = () => {
    alert("Browser extension download initiated. This would typically download a browser extension for enhanced functionality.");
  };

  return (
    <div className="space-y-6">
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-xl">
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedVideo.name}</h3>
              <button 
                onClick={handleCloseVideo}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 bg-black aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p>Video player would appear here</p>
                <p className="text-sm text-gray-400 mt-2">
                  This is a placeholder for the actual video player component
                </p>
              </div>
            </div>
            <div className="p-4 flex justify-end space-x-2 bg-gray-100">
              <Button variant="outline" onClick={handleCloseVideo}>
                Close
              </Button>
              <Button onClick={() => window.open("#", "_blank")}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Files</h1>
        <p className="text-gray-500 mt-1">Access and download your purchased files and resources.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
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
                        <Video className="h-4 w-4 mr-2" />
                        <span>{file.name}</span>
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.dateAdded}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handlePlayVideo(file)}
                          >
                            <Video className="h-4 w-4 mr-1" /> Watch
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No videos found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <div className="p-6 border-t border-gray-200 flex items-center justify-center">
          <Button onClick={handleDownloadExtension}>
            <Download className="h-4 w-4 mr-2" />
            Download Extension
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Downloads;
