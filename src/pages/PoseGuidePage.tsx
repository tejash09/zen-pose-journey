
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { PoseGuide } from "@/components/pose-guide/PoseGuide";
import { yogaPoses } from "@/data/yogaPoses";
import { YogaPose } from "@/types/yoga";
import { motion } from "framer-motion";

const PoseGuidePage = () => {
  const { poseId } = useParams<{ poseId: string }>();
  const navigate = useNavigate();
  const [pose, setPose] = useState<YogaPose | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!poseId) {
      navigate("/pose-library");
      return;
    }

    // Find the pose in the yoga poses data
    const foundPose = yogaPoses.find(p => p.id === poseId);
    if (foundPose) {
      setPose(foundPose);
    } else {
      // Pose not found, redirect to the pose library
      navigate("/pose-library");
    }
    
    setLoading(false);
  }, [poseId, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 mt-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <p className="text-lg text-gray-500">Loading pose information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pose) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 mt-16 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg text-gray-500">Pose not found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        className="container mx-auto px-4 py-8 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PoseGuide pose={pose} />
      </motion.div>
    </Layout>
  );
};

export default PoseGuidePage;
