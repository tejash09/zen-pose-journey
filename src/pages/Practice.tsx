
import React, { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { WebcamView } from "@/components/practice/WebcamView";
import { PoseInfo } from "@/components/practice/PoseInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Practice = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [posesDetected, setPosesDetected] = useState(0);
  const [totalConfidence, setTotalConfidence] = useState(0);
  const [currentPose, setCurrentPose] = useState({
    name: "Waiting for pose...",
    confidence: 0,
    duration: 0,
  });
  
  // Mock poses for demonstration
  const mockPoses = [
    { name: "Mountain Pose (Tadasana)", confidence: 92 },
    { name: "Downward Dog (Adho Mukha Svanasana)", confidence: 87 },
    { name: "Warrior I (Virabhadrasana I)", confidence: 85 },
    { name: "Tree Pose (Vrikshasana)", confidence: 88 },
    { name: "Triangle Pose (Trikonasana)", confidence: 83 }
  ];
  
  const detectPoseSimulation = useCallback(() => {
    if (!isActive) return;
    
    // Randomly select a pose from our mock poses
    const randomIndex = Math.floor(Math.random() * mockPoses.length);
    const selectedPose = mockPoses[randomIndex];
    
    // Add a little randomness to confidence for realism
    const confidenceVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const adjustedConfidence = Math.min(100, Math.max(0, selectedPose.confidence + confidenceVariation));
    
    setCurrentPose(prev => {
      const isNewPose = prev.name !== selectedPose.name;
      const newDuration = isNewPose ? 0 : prev.duration + 3;
      
      if (isNewPose && prev.name !== "Waiting for pose...") {
        setPosesDetected(count => count + 1);
        setTotalConfidence(total => total + adjustedConfidence);
        toast.info(`Detected: ${selectedPose.name}`, {
          description: `Confidence: ${adjustedConfidence}%`
        });
      }
      
      return {
        name: selectedPose.name,
        confidence: adjustedConfidence,
        duration: newDuration
      };
    });
  }, [isActive, mockPoses]);

  // Session timer
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  // Pose detection simulation
  useEffect(() => {
    let poseInterval: number | null = null;
    
    if (isActive) {
      // Initial detection
      detectPoseSimulation();
      
      // Periodically update pose detection
      poseInterval = window.setInterval(() => {
        detectPoseSimulation();
      }, 3000);
    }
    
    return () => {
      if (poseInterval) clearInterval(poseInterval);
    };
  }, [isActive, detectPoseSimulation]);

  const toggleActive = () => {
    if (!isActive) {
      toast.success("Session started", {
        description: "Move slowly and hold poses for accurate detection"
      });
    } else {
      toast.info("Session paused");
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setSessionTime(0);
    setPosesDetected(0);
    setTotalConfidence(0);
    setCurrentPose({
      name: "Waiting for pose...",
      confidence: 0,
      duration: 0,
    });
    toast.success("Session reset");
  };
  
  // Format time from seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate average confidence
  const averageConfidence = posesDetected > 0 
    ? Math.round(totalConfidence / posesDetected) 
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4">
            Practice Your Yoga
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use your webcam to get real-time feedback on your yoga poses. Position yourself in view of the camera and strike a pose.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WebcamView isActive={isActive} />
            
            <div className="flex justify-center gap-4 mt-4">
              <Button 
                onClick={toggleActive}
                className={isActive ? "bg-red-500 hover:bg-red-600" : "bg-sage-400 hover:bg-sage-500"}
              >
                {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" onClick={resetSession}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs defaultValue="pose" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pose">Current Pose</TabsTrigger>
                <TabsTrigger value="stats">Session Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="pose" className="mt-4">
                <PoseInfo pose={currentPose} />
              </TabsContent>
              <TabsContent value="stats" className="mt-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-medium text-xl mb-4">Session Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Session Duration</p>
                      <p className="text-2xl font-semibold">{formatTime(sessionTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Poses Detected</p>
                      <p className="text-2xl font-semibold">{posesDetected}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Confidence</p>
                      <p className="text-2xl font-semibold">{averageConfidence}%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Practice;
