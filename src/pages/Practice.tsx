
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Practice = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-16">
        <motion.div
          className="max-w-3xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-semibold mb-6">
            Practice Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This page will contain the webcam pose classifier feature in the next version.
          </p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Practice;
