import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { CodeIcon, BarChartIcon, CpuIcon } from '../../components/Icons';

interface LandingPageProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-background-secondary p-6 rounded-lg border border-border text-center">
    <div className="flex justify-center mb-4 text-accent-primary">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-text-primary">{title}</h3>
    <p className="text-sm text-text-tertiary">{children}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-background-primary min-h-screen flex flex-col items-center justify-center p-4 font-sans text-text-primary">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Welcome to <span className="text-accent-primary">CS</span>Lab
        </h1>
        <p className="text-lg md:text-xl text-text-secondary mb-8">
          An interactive educational platform designed to make complex computer science concepts intuitive and engaging.
        </p>
        <Button onClick={onStart} size="lg" className="px-10 py-4 text-lg">
          Start Learning
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <FeatureCard icon={<BarChartIcon className="w-8 h-8" />} title="Interactive Simulators">
          Visualize algorithms step-by-step. Control the simulation speed and see how data structures change in real-time.
        </FeatureCard>
        <FeatureCard icon={<CodeIcon className="w-8 h-8" />} title="Detailed Articles">
          Dive deep into the theory, complexity analysis, and real-world applications of each algorithm.
        </FeatureCard>
         <FeatureCard icon={<CpuIcon className="w-8 h-8" />} title="Wide Range of Topics">
          Explore topics from sorting and searching to cryptography, operating systems, and more.
        </FeatureCard>
      </motion.div>
    </div>
  );
};

export default LandingPage;