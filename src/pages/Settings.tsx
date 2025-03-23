
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Camera, BellRing, Cpu, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  // Camera Settings
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraResolution, setCameraResolution] = useState("720p");
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  
  // Notification Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [poseAlerts, setPoseAlerts] = useState(true);
  const [sessionSummary, setSessionSummary] = useState(true);
  
  // Performance Settings
  const [detectionFrequency, setDetectionFrequency] = useState("medium");
  const [modelPrecision, setModelPrecision] = useState([50]);
  
  // Display Settings
  const [showConfidence, setShowConfidence] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [showPoseHistory, setShowPoseHistory] = useState(true);
  
  const saveSettings = () => {
    // In a real app, you would persist these settings
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold">Settings</h1>
              <p className="text-lg text-gray-600 mt-2">Customize your yoga practice experience</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/practice">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Practice
                </Link>
              </Button>
              <Button onClick={saveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="camera">
                <Camera className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Camera</span>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <BellRing className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Cpu className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="display">
                <Monitor className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera">
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-6">Camera Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Enable Camera</h3>
                      <p className="text-sm text-gray-500">Toggle camera access for pose detection</p>
                    </div>
                    <Switch 
                      checked={cameraEnabled} 
                      onCheckedChange={setCameraEnabled} 
                    />
                  </div>
                  
                  <div>
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-md font-medium">Camera Resolution</h3>
                      <p className="text-sm text-gray-500">Choose your preferred camera quality</p>
                    </div>
                    <Select value={cameraResolution} onValueChange={setCameraResolution}>
                      <SelectTrigger className="w-full sm:w-[240px] mt-2">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Camera Resolution</SelectLabel>
                          <SelectItem value="360p">360p (Low)</SelectItem>
                          <SelectItem value="480p">480p (Medium)</SelectItem>
                          <SelectItem value="720p">720p (High)</SelectItem>
                          <SelectItem value="1080p">1080p (Very High)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-md font-medium">Confidence Threshold: {confidenceThreshold}%</h3>
                      <p className="text-sm text-gray-500">Minimum confidence level for pose detection</p>
                    </div>
                    <Slider 
                      value={confidenceThreshold} 
                      onValueChange={setConfidenceThreshold} 
                      max={100} 
                      step={5}
                      className="mt-4"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-6">Notification Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Sound Notifications</h3>
                      <p className="text-sm text-gray-500">Play sounds for pose detection events</p>
                    </div>
                    <Switch 
                      checked={soundEnabled} 
                      onCheckedChange={setSoundEnabled} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Pose Detection Alerts</h3>
                      <p className="text-sm text-gray-500">Receive alerts when a new pose is detected</p>
                    </div>
                    <Switch 
                      checked={poseAlerts} 
                      onCheckedChange={setPoseAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Session Summary</h3>
                      <p className="text-sm text-gray-500">Get a summary at the end of each practice session</p>
                    </div>
                    <Switch 
                      checked={sessionSummary} 
                      onCheckedChange={setSessionSummary} 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance">
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-6">Performance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-md font-medium">Detection Frequency</h3>
                      <p className="text-sm text-gray-500">How often the app detects poses</p>
                    </div>
                    <Select value={detectionFrequency} onValueChange={setDetectionFrequency}>
                      <SelectTrigger className="w-full sm:w-[240px] mt-2">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Detection Frequency</SelectLabel>
                          <SelectItem value="low">Low (Battery saving)</SelectItem>
                          <SelectItem value="medium">Medium (Balanced)</SelectItem>
                          <SelectItem value="high">High (Best accuracy)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-md font-medium">Model Precision: {modelPrecision}%</h3>
                      <p className="text-sm text-gray-500">Balance between speed and accuracy</p>
                    </div>
                    <Slider 
                      value={modelPrecision} 
                      onValueChange={setModelPrecision} 
                      max={100} 
                      step={10}
                      className="mt-4"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="display">
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-6">Display Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Show Confidence Score</h3>
                      <p className="text-sm text-gray-500">Display confidence percentage for detected poses</p>
                    </div>
                    <Switch 
                      checked={showConfidence} 
                      onCheckedChange={setShowConfidence} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Show Timer</h3>
                      <p className="text-sm text-gray-500">Display time spent in each pose</p>
                    </div>
                    <Switch 
                      checked={showTimer} 
                      onCheckedChange={setShowTimer} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Show Pose History</h3>
                      <p className="text-sm text-gray-500">Display list of previously detected poses</p>
                    </div>
                    <Switch 
                      checked={showPoseHistory} 
                      onCheckedChange={setShowPoseHistory} 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
