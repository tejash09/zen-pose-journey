
import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { WebcamView } from "@/components/practice/WebcamView";
import { PoseInfo } from "@/components/practice/PoseInfo";
import { ScreenCapture } from "@/components/practice/ScreenCapture";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { checkApiHealth, loadModels, detectPose, captureVideoFrame } from "@/services/poseDetectionService";

const Practice = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [posesDetected, setPosesDetected] = useState(0);
  const [totalConfidence, setTotalConfidence] = useState(0);
  const [currentPose, setCurrentPose] = useState({
    name: "Waiting for pose...",
    confidence: 0,
    duration: 0,
  });
  const [apiStatus, setApiStatus] = useState<"loading" | "ready" | "error">("loading");
  const [currentKeypoints, setCurrentKeypoints] = useState<number[][] | null>(null);
  const [availablePoses, setAvailablePoses] = useState<string[]>([]);
  const [lastPoseName, setLastPoseName] = useState<string>("");
  
  // Check API health and load models when component mounts
  useEffect(() => {
    const initializeApi = async () => {
      try {
        const health = await checkApiHealth();
        if (health.status === "healthy") {
          if (!health.modelsLoaded) {
            toast.info("Loading pose detection models...");
            const poses = await loadModels();
            setAvailablePoses(poses);
            toast.success("Pose detection models loaded", {
              description: `${poses.length} poses available for detection`
            });
          } else {
            // Models already loaded, just get the available poses
            const poses = await loadModels();
            setAvailablePoses(poses);
          }
          setApiStatus("ready");
        } else {
          throw new Error("API is not healthy");
        }
      } catch (error) {
        console.error("Error initializing API:", error);
        setApiStatus("error");
        toast.error("Failed to connect to pose detection API", {
          description: "Please ensure the Python API is running on your server"
        });
      }
    };
    
    initializeApi();
  }, []);
  
  // Real pose detection using the API
  const detectPoseFromVideo = useCallback(async () => {
    if (!isActive || !videoRef.current || apiStatus !== "ready") return;
    
    try {
      // Capture the current video frame
      const imageData = captureVideoFrame(videoRef.current);
      if (!imageData) return;
      
      // Send to API for detection
      const result = await detectPose(imageData);
      
      if (result.error) {
        console.error("Error detecting pose:", result.error);
        return;
      }
      
      // Save keypoints for visualization
      if (result.keypoints) {
        setCurrentKeypoints(result.keypoints);
      }
      
      const poseName = result.pose_name;
      const confidence = Math.round(result.confidence * 100);
      
      setCurrentPose(prev => {
        const isNewPose = poseName !== lastPoseName && poseName !== "Not enough keypoints visible";
        const newDuration = isNewPose ? 0 : prev.duration + 1;
        
        if (isNewPose && lastPoseName && lastPoseName !== "Not enough keypoints visible" && lastPoseName !== "Waiting for pose...") {
          setPosesDetected(count => count + 1);
          setTotalConfidence(total => total + confidence);
          toast.info(`Detected: ${poseName}`, {
            description: `Confidence: ${confidence}%`
          });
        }
        
        // Update the last detected pose name
        if (poseName !== "Not enough keypoints visible") {
          setLastPoseName(poseName);
        }
        
        return {
          name: poseName,
          confidence: confidence,
          duration: newDuration
        };
      });
    } catch (error) {
      console.error("Error in pose detection:", error);
      if (isActive) {
        toast.error("Pose detection failed", {
          description: "Check console for details"
        });
      }
    }
  }, [isActive, apiStatus, lastPoseName]);
  
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
  
  // Setup pose detection interval
  useEffect(() => {
    let poseInterval: number | null = null;
    
    if (isActive && apiStatus === "ready") {
      // Detect pose immediately
      detectPoseFromVideo();
      
      // Then set up interval
      poseInterval = window.setInterval(() => {
        detectPoseFromVideo();
      }, 1000); // Check pose every second
    }
    
    return () => {
      if (poseInterval) clearInterval(poseInterval);
    };
  }, [isActive, detectPoseFromVideo, apiStatus]);
  
  const toggleActive = () => {
    if (apiStatus !== "ready") {
      toast.error("Pose detection API not ready", {
        description: "Please ensure the Python API is running on your server"
      });
      return;
    }
    
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
    setCurrentKeypoints(null);
    setLastPoseName("");
    toast.success("Session reset");
  };
  
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
          {apiStatus === "error" && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
              <p className="font-medium">Pose detection API not connected</p>
              <p className="text-sm">Please ensure the Python API is running on your server</p>
            </div>
          )}
          {apiStatus === "loading" && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="font-medium">Connecting to pose detection API...</p>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WebcamView 
              isActive={isActive} 
              videoRef={videoRef} 
              keypoints={currentKeypoints}
            />
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button 
                onClick={toggleActive}
                className={isActive ? "bg-red-500 hover:bg-red-600" : "bg-sage-400 hover:bg-sage-500"}
                disabled={apiStatus !== "ready"}
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
            
            <div className="mt-4">
              <ScreenCapture videoRef={videoRef} isActive={isActive} />
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
                    {availablePoses.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Available Poses</p>
                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                          {availablePoses.map((pose, index) => (
                            <li key={index}>• {pose}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
