
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { yogaPoses } from "@/data/yogaPoses";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

interface PoseInfoProps {
  pose: {
    name: string;
    confidence: number;
    duration: number;
  };
  poseReferenceId?: string | null;
}

export const PoseInfo: React.FC<PoseInfoProps> = ({ pose, poseReferenceId }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Find reference pose details if we have a valid ID
  const referenceImage = poseReferenceId 
    ? yogaPoses.find(p => p.id === poseReferenceId) 
    : null;

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
            <p className="text-sm font-medium">{pose.confidence}%</p>
          </div>
          <Progress value={pose.confidence} className="h-2" />
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Hold Duration</p>
          <p className="text-2xl font-semibold">{formatDuration(pose.duration)}</p>
        </div>
        
        {referenceImage && (
          <>
            <Separator className="my-2" />
            
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 mb-2">Reference Image</p>
                <Link 
                  to={`/pose-guide/${referenceImage.id}`}
                  className="text-sm text-sage-600 hover:text-sage-800 flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  <span>Guide</span>
                </Link>
              </div>
              
              <div className="overflow-hidden rounded-md border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center relative">
                {referenceImage.imageUrl ? (
                  <img 
                    src={referenceImage.imageUrl} 
                    alt={referenceImage.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No image available</div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {referenceImage.name}
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500 mb-2">Tips</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Ensure good lighting in your practice area</li>
            <li>• Position yourself so your full body is visible</li>
            <li>• Move slowly and hold poses steadily</li>
            <li>• Try to maintain at least 70% confidence for best results</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
