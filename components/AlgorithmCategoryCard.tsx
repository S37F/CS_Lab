import React from 'react';
import { motion } from 'framer-motion';
import type { Algorithm } from '../types';

interface AlgorithmCategoryCardProps {
    icon: React.ReactNode;
    title: string;
    algorithms: Algorithm[];
    description: string;
}

const AlgorithmCategoryCard: React.FC<AlgorithmCategoryCardProps> = ({ icon, title, algorithms, description }) => {
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-background-secondary p-6 rounded-lg border border-border transition-all duration-300 hover:border-accent-primary hover:shadow-2xl hover:shadow-accent-primary/10"
        >
            <div className="flex items-center mb-4">
                <div className="mr-4">{icon}</div>
                <h3 className="text-xl font-bold text-text-primary">{title}</h3>
            </div>
            <p className="text-text-tertiary mb-4 text-sm">{description}</p>
            <ul className="space-y-1">
                {algorithms.slice(0, 4).map(algo => (
                    <li key={algo.name} className="text-xs font-mono text-text-secondary">{algo.name}</li>
                ))}
            </ul>
        </motion.div>
    );
};

export default AlgorithmCategoryCard;
