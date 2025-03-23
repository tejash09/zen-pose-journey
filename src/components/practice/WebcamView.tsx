
import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface WebcamViewProps {
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const WebcamView: React.FC<WebcamViewProps> = ({ isActive, videoRef: externalVideoRef }) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        if (!isActive) return;
        
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setWebcamError(null);
          toast.success("Webcam started successfully");
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setHasPermission(false);
        setWebcamError(
          error instanceof Error 
            ? error.message 
            : "Could not access webcam. Please check your permissions."
        );
        toast.error("Failed to access webcam", {
          description: "Please check your camera permissions and try again"
        });
      }
    };

    const stopWebcam = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isActive, videoRef]);

  return (
    <Card className="overflow-hidden relative aspect-video bg-gray-100 flex items-center justify-center border-2 border-sage-100">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${hasPermission === false ? 'hidden' : ''}`}
          />
          
          {hasPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-red-600">Camera Access Denied</h3>
              <p className="text-gray-600 mb-4">{webcamError || "Please allow camera access to use pose detection"}</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Webcam Inactive</h3>
          <p className="text-gray-500">
            Click "Start" to activate the webcam and begin pose detection
          </p>
        </div>
      )}
      {isActive && hasPermission && (
        <div className="absolute bottom-3 right-3 bg-sage-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Live
        </div>
      )}
    </Card>
  );
};
