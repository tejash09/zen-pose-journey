
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-10" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Floating shapes for visual interest */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-sage-100/40 -z-5 blur-2xl"
        animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-sky-100/40 -z-5 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <motion.div 
        className="max-w-3xl space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-sm font-medium bg-sage-100 text-sage-600 px-3 py-1 rounded-full mb-4">
            Discover Your Practice
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold leading-tight md:leading-tight lg:leading-tight mb-4 text-gray-900">
            Yoga Pose <span className="text-sage-500">Classifier</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
            Enhance your yoga practice with real-time pose detection and guidance. 
            Perfect your form and deepen your understanding of each asana.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild className="bg-sage-400 hover:bg-sage-500 text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/practice">
              Start Practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-sage-200 text-sage-700 hover:bg-sage-50 px-8 py-6 rounded-full text-lg font-medium transition-all duration-300">
            <Link to="/pose-library">
              Explore Poses
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div 
            className="w-1 h-2 bg-gray-400 rounded-full mt-2"
            animate={{ height: [8, 14, 8] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
