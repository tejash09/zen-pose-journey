
import React from "react";
import { Card } from "@/components/ui/card";

interface WebcamViewProps {
  isActive: boolean;
}

export const WebcamView: React.FC<WebcamViewProps> = ({ isActive }) => {
  return (
    <Card className="overflow-hidden relative aspect-video bg-gray-100 flex items-center justify-center border-2 border-sage-100">
      {isActive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">
            Webcam access will be implemented in the next version
          </p>
        </div>
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
      {isActive && (
        <div className="absolute bottom-3 right-3 bg-sage-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Live
        </div>
      )}
    </Card>
  );
};
