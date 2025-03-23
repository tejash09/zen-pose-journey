
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-100 text-sage-500 mb-6 text-3xl font-semibold">
          404
        </div>
        <h1 className="text-3xl font-display font-semibold mb-4 text-gray-900">Page not found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. Let's get you back to the home page.
        </p>
        <Button asChild className="bg-sage-400 hover:bg-sage-500">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
