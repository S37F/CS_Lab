
import React from 'react';
import { motion } from 'framer-motion';
import type { Algorithm } from '../../types';

interface CategorySelectionPageProps {
    categories: string[];
    groupedAlgorithms: Record<string, Algorithm[]>;
    categoryIcons: { [key: string]: React.ReactElement<{ className?: string }> };
    onSelectCategory: (categoryName: string) => void;
}

const CategoryCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.03 }}
        className="bg-background-secondary p-6 rounded-lg border border-border transition-all duration-300 hover:border-accent-primary hover:shadow-2xl hover:shadow-accent-primary/10 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center mb-4">
            <div className="mr-4 text-accent-primary">{icon}</div>
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        </div>
        <p className="text-text-tertiary text-sm">{description}</p>
    </motion.div>
);

const CategorySelectionPage: React.FC<CategorySelectionPageProps> = ({ categories, groupedAlgorithms, categoryIcons, onSelectCategory }) => {
    
    const categoryDescriptions: {[key:string]: string} = {
        'Number Systems': "Master digital representation and conversion techniques",
        'Error Control': "Learn data integrity and error correction methods",
        'Compression': "Understand data compression and encoding algorithms",
        'Operating Systems': "Explore process scheduling and system management",
        'Memory Management': "Master memory allocation and page replacement",
        'Disk Scheduling': "Optimize disk head movement and access time",
        'Graph Algorithms': "Navigate graph theory and pathfinding algorithms",
        'Sorting': "Perfect your understanding of sorting techniques",
        'Database': "Learn database optimization and integrity",
        'Automata': "Explore computational models and formal languages",
        'Cryptography': "Understand security and encryption algorithms",
        'Logic Circuits': "Simplify boolean expressions and logic",
        'Computer Networks': "Simulate reliability, routing, and access control protocols",
        'Artificial Intelligence': "Explore search strategies, optimization, and machine learning",
        'Data Warehouse & Data Mining': "Discover patterns, grouping, and classification techniques",
        'Statistical Analysis': "Visualize statistical tests, inference, and modeling",
    };

    return (
        <div className="p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to the Simulator</h1>
                <p className="text-text-secondary mb-8">Select a category to begin exploring, or choose a specific algorithm from the sidebar.</p>
            </motion.div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
            >
                {categories.map(category => (
                    <motion.div key={category} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <CategoryCard 
                            icon={React.cloneElement(categoryIcons[category], { className: "w-8 h-8"})}
                            title={category}
                            description={categoryDescriptions[category] || `Explore ${groupedAlgorithms[category].length} algorithms.`}
                            onClick={() => onSelectCategory(category)}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default CategorySelectionPage;
