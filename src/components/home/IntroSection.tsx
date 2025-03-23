
import React from "react";
import { motion } from "framer-motion";

const IntroSection: React.FC = () => {
  const features = [
    {
      title: "Real-time Classification",
      description: "Get instant feedback on your yoga poses with advanced AI detection",
      icon: "📊",
    },
    {
      title: "Pose Library",
      description: "Browse our collection of yoga poses with detailed instructions",
      icon: "📚",
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement over time with session tracking",
      icon: "📈",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Enhance Your Yoga Journey
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our AI-powered yoga assistant helps you perfect your form and deepen your practice
            with real-time feedback and personalized guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-sage-50 w-12 h-12 flex items-center justify-center rounded-xl mb-5 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
