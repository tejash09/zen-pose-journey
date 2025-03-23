
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { PoseCard } from "@/components/pose-library/PoseCard";
import { PoseFilter } from "@/components/pose-library/PoseFilter";
import { motion } from "framer-motion";
import { yogaPoses } from "@/data/yogaPoses";

const PoseLibrary = () => {
  const [filteredPoses, setFilteredPoses] = useState(yogaPoses);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredPoses(yogaPoses);
    } else {
      setFilteredPoses(
        yogaPoses.filter((pose) => pose.difficulty === filter)
      );
    }
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
            Yoga Pose Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of yoga poses. Filter by difficulty level and click on a pose to learn more about its benefits and proper form.
          </p>
        </motion.div>

        <PoseFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredPoses.map((pose, index) => (
            <PoseCard key={pose.id} pose={pose} index={index} />
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PoseLibrary;
