
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Download, Trash } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface ScreenCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

export const ScreenCapture: React.FC<ScreenCaptureProps> = ({ videoRef, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isActive) {
      toast.error("Cannot capture image", {
        description: "Webcam must be active to capture an image"
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);
    
    toast.success("Image captured", {
      description: "You can download or delete the image"
    });
  };

  const downloadImage = () => {
    if (!capturedImage) return;

    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `yoga-pose-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`;
    link.click();
    
    toast.success("Image downloaded");
  };

  const deleteImage = () => {
    setCapturedImage(null);
    toast.info("Image deleted");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button 
          onClick={captureImage} 
          disabled={!isActive}
          variant="outline"
          size="sm"
        >
          <Camera className="mr-2 h-4 w-4" />
          Capture Pose
        </Button>
        
        {capturedImage && (
          <>
            <Button 
              onClick={downloadImage} 
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button 
              onClick={deleteImage} 
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
      
      {capturedImage && (
        <Card className="p-2 mt-2 bg-white">
          <img 
            src={capturedImage} 
            alt="Captured pose" 
            className="max-h-48 w-auto mx-auto rounded"
          />
        </Card>
      )}
      
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
