
import React from 'react';
import { motion } from 'framer-motion';
import type { Algorithm } from '../../types';
import { ChevronLeftIcon } from '../../components/Icons';
import Button from '../../components/ui/Button';

interface AlgorithmSelectionPageProps {
    category: string;
    algorithms: Algorithm[];
    categoryIcons: { [key: string]: React.ReactElement<{ className?: string }> };
    onSelectAlgorithm: (algoName: string) => void;
    onGoBack: () => void;
}

const AlgorithmSelectionPage: React.FC<AlgorithmSelectionPageProps> = ({
    category,
    algorithms,
    categoryIcons,
    onSelectAlgorithm,
    onGoBack,
}) => {
    const icon = categoryIcons[category] ? React.cloneElement(categoryIcons[category], { className: "w-10 h-10" }) : null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div>
            <Button onClick={onGoBack} variant="ghost" className="mb-6 inline-flex items-center text-text-secondary hover:text-text-primary">
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Back to All Categories
            </Button>
            
            <header className="flex items-center mb-8">
                {icon}
                <div className="ml-4">
                    <h1 className="text-3xl font-bold text-text-primary">{category}</h1>
                    <p className="text-text-secondary">Select an algorithm to begin.</p>
                </div>
            </header>
            
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {algorithms.sort((a,b) => a.name.localeCompare(b.name)).map(algo => (
                    <motion.div key={algo.name} variants={itemVariants}>
                        <button
                            onClick={() => onSelectAlgorithm(algo.name)}
                            className="w-full p-4 bg-background-secondary rounded-lg border border-border text-left transition-all duration-200 hover:border-accent-primary hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            <h4 className="font-semibold text-text-primary">{algo.name}</h4>
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AlgorithmSelectionPage;
