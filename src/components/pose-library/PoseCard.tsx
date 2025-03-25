
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { YogaPose } from "@/types/yoga";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

interface PoseCardProps {
  pose: YogaPose;
  index: number;
}

export const PoseCard = ({ pose, index }: PoseCardProps) => {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="h-48 overflow-hidden bg-gray-100 relative">
          <img
            src={pose.imageUrl}
            alt={pose.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{pose.name}</CardTitle>
            <Badge className={difficultyColor[pose.difficulty as keyof typeof difficultyColor]}>
              {pose.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-sm italic">{pose.sanskritName}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 text-sm">{pose.description}</p>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">Benefits: {pose.benefits.join(", ")}</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/pose-guide/${pose.id}`} className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Guide
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
