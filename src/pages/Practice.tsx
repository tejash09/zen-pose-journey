import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { WebcamView } from "@/components/practice/WebcamView";
import { PoseInfo } from "@/components/practice/PoseInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Practice = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPose, setCurrentPose] = useState({
    name: "Waiting for pose...",
    confidence: 0,
    duration: 0,
  });

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPose({
      name: "Waiting for pose...",
      confidence: 0,
      duration: 0,
    });
  };

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
                      <p className="text-2xl font-semibold">00:00:00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Poses Detected</p>
                      <p className="text-2xl font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Confidence</p>
                      <p className="text-2xl font-semibold">0%</p>
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
