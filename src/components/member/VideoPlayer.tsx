
import { Button } from "@/components/ui/button";
import { Download, Video } from "lucide-react";

interface VideoPlayerProps {
  file: {
    id: number;
    name: string;
    type: string;
    size: string;
    dateAdded: string;
  };
  onClose: () => void;
}

const VideoPlayer = ({ file, onClose }: VideoPlayerProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-xl">
        <div className="p-4 bg-primary text-white flex justify-between items-center">
          <h3 className="text-lg font-medium">{file.name}</h3>
          <button 
            onClick={onClose}
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.open("#", "_blank")}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
