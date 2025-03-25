
import React from "react";
import { YogaPose } from "@/types/yoga";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface PoseGuideProps {
  pose: YogaPose;
}

export const PoseGuide: React.FC<PoseGuideProps> = ({ pose }) => {
  const navigate = useNavigate();
  
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };
  
  // Example instructions - in a real app, these would be part of the YogaPose type
  const getInstructions = (poseId: string) => {
    const defaultInstructions = [
      "Stand in a comfortable position with your feet hip-width apart",
      "Engage your core and maintain good posture",
      "Breathe deeply and focus on your balance",
      "Hold the pose for 30-60 seconds",
      "Release the pose gently and return to starting position"
    ];
    
    // Specific instructions for some poses
    const poseInstructions: Record<string, string[]> = {
      "tree-pose": [
        "Start in a standing position with feet hip-width apart",
        "Shift your weight onto your right foot",
        "Place the sole of your left foot on your inner right thigh, with toes pointing down",
        "Bring your palms together at your heart center",
        "Fix your gaze on a point in front of you to maintain balance",
        "Hold for 30-60 seconds, then switch sides"
      ],
      "warrior-2-pose": [
        "Stand with your feet wide apart, 3-4 feet",
        "Turn your right foot out 90 degrees and your left foot in slightly",
        "Extend your arms out to the sides, parallel to the floor",
        "Bend your right knee to align directly over the right ankle",
        "Turn your head to gaze over your right fingertips",
        "Hold for 30-60 seconds, then switch sides"
      ],
      "downward-facing-dog-pose": [
        "Start on your hands and knees, with wrists under shoulders and knees under hips",
        "Spread your fingers wide and press firmly through your palms",
        "Tuck your toes and lift your knees off the floor",
        "Straighten your legs as much as possible and lift your hips high",
        "Keep your head between your arms and relax your neck",
        "Hold for 1-3 minutes, breathing deeply"
      ]
    };
    
    return poseInstructions[poseId] || defaultInstructions;
  };
  
  // Example alignment tips
  const getAlignmentTips = (poseId: string) => {
    const defaultTips = [
      "Keep your spine straight",
      "Distribute weight evenly",
      "Don't strain or force the position"
    ];
    
    const poseTips: Record<string, string[]> = {
      "tree-pose": [
        "Keep your standing leg straight but not locked",
        "Press your foot firmly into your thigh (never on the knee)",
        "Keep your hips level and facing forward",
        "Engage your core for stability"
      ],
      "warrior-2-pose": [
        "Keep your front knee directly above your ankle, not pushed forward",
        "Press the outer edge of your back foot firmly into the mat",
        "Keep your shoulders directly above your hips",
        "Reach actively through your fingertips"
      ],
      "downward-facing-dog-pose": [
        "Press the floor away from you, don't sink into your shoulders",
        "Rotate your upper arms outward to broaden the shoulders",
        "Keep your weight balanced between hands and feet",
        "Send your sitting bones up toward the ceiling"
      ]
    };
    
    return poseTips[poseId] || defaultTips;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-display font-semibold">{pose.name}</h1>
        <Badge className={difficultyColor[pose.difficulty]}>
          {pose.difficulty}
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="overflow-hidden">
            <div className="h-64 md:h-80 overflow-hidden bg-gray-100">
              <img
                src={pose.imageUrl}
                alt={pose.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{pose.name}</CardTitle>
              <CardDescription className="text-sm italic">{pose.sanskritName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{pose.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Benefits:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {pose.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 flex justify-center gap-4">
            <Button asChild>
              <Link to="/practice">
                Practice Now
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pose-library">
                View All Poses
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-sage-500" />
                Step-by-Step Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4">
                {getInstructions(pose.id).map((instruction, index) => (
                  <li key={index} className="text-gray-700">
                    {instruction}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-sage-500" />
                Alignment Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {getAlignmentTips(pose.id).map((tip, index) => (
                  <li key={index} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-sage-500" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700">Forcing the body into a position that feels painful</li>
                <li className="text-gray-700">Holding your breath during the pose</li>
                <li className="text-gray-700">Losing proper alignment to go deeper into the pose</li>
                <li className="text-gray-700">Rushing through the pose without proper form</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
