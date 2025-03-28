
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PoseInfoProps {
  pose: {
    name: string;
    confidence: number;
    duration: number;
  };
}

export const PoseInfo: React.FC<PoseInfoProps> = ({ pose }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Format confidence to display percentage correctly
  const displayConfidence = typeof pose.confidence === 'number' 
    ? (pose.confidence > 1 ? pose.confidence : Math.round(pose.confidence * 100))
    : 0;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h3 className="font-medium text-xl mb-4">Current Pose</h3>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Detected Pose</p>
          <p className="text-2xl font-semibold">{pose.name}</p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="text-sm font-medium">{displayConfidence}%</p>
          </div>
          <Progress value={displayConfidence} className="h-2" />
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Hold Duration</p>
          <p className="text-2xl font-semibold">{formatDuration(pose.duration)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500 mb-2">Tips</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Ensure good lighting in your practice area</li>
            <li>• Position yourself so your full body is visible</li>
            <li>• Move slowly and hold poses steadily</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
