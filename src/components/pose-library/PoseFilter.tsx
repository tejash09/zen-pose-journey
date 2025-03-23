
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PoseFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PoseFilter = ({ activeFilter, onFilterChange }: PoseFilterProps) => {
  const filters = [
    { id: "all", label: "All Poses" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-2 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={`
            ${activeFilter === filter.id 
              ? "bg-sage-400 hover:bg-sage-500" 
              : "hover:bg-sage-50"}
          `}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </motion.div>
  );
};
