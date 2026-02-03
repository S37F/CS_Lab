
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import AlgorithmCategoryCard from '../../components/AlgorithmCategoryCard';
import type { Algorithm } from '../../types';
import { PlayIcon, CodeIcon, GraduationCapIcon, ShieldCheckIcon, DatabaseIcon, LockIcon } from '../../components/Icons';

interface AboutPageProps {
    stats: {
        algorithms: number;
        categories: number;
    };
    categories: string[];
    groupedAlgorithms: Record<string, Algorithm[]>;
    categoryIcons: { [key: string]: React.ReactElement<{ className?: string }> };
}

const StatCard: React.FC<{ value: string | number, label: string }> = ({ value, label }) => (
    <div className="bg-background-secondary p-4 rounded-lg border border-border text-center">
        <p className="text-3xl font-bold text-accent-primary">{value}</p>
        <p className="text-sm text-text-tertiary">{label}</p>
    </div>
);

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <motion.div 
        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} 
        className="bg-background-secondary p-6 rounded-lg border border-border text-left"
    >
        <div className="flex items-center mb-3">
            <div className="mr-4 text-accent-primary">{icon}</div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <p className="text-sm text-text-secondary">{children}</p>
    </motion.div>
);


const AboutPage: React.FC<AboutPageProps> = ({ stats, categories, groupedAlgorithms, categoryIcons }) => {
    
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const sectionVariant: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    
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
    }

    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background-primary w-full">
            <div className="max-w-5xl mx-auto space-y-24">
                {/* Hero Section */}
                <motion.section 
                    className="text-center py-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">Transforming Algorithm Education Through Interactive Learning</h1>
                    <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                        Where complex computer science concepts become visual, engaging, and accessible to everyone.
                    </p>
                    <motion.div 
                        className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                       <motion.div variants={sectionVariant}><StatCard value={`${stats.algorithms}+`} label="Algorithms"/></motion.div>
                       <motion.div variants={sectionVariant}><StatCard value={`${stats.categories}`} label="Categories"/></motion.div>
                       <motion.div variants={sectionVariant}><StatCard value="100s" label="Visualizations"/></motion.div>
                    </motion.div>
                </motion.section>
                
                {/* Mission Section */}
                <motion.section
                     variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-center text-text-primary mb-8">Our Mission</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-text-secondary">
                        <div className="bg-background-secondary p-6 rounded-lg border border-border">Democratize algorithm education through cutting-edge visualization.</div>
                        <div className="bg-background-secondary p-6 rounded-lg border border-border">Bridge the gap between theoretical computer science and practical understanding.</div>
                        <div className="bg-background-secondary p-6 rounded-lg border border-border">Empower learners with interactive tools that make complex concepts intuitive.</div>
                        <div className="bg-background-secondary p-6 rounded-lg border border-border">Support educators with comprehensive resources for algorithm instruction.</div>
                    </div>
                </motion.section>

                {/* Why CSLab Stands Apart */}
                <motion.section
                    variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-center text-text-primary mb-12">Why CSLab Stands Apart</h2>
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <FeatureHighlightCard icon={<PlayIcon className="w-6 h-6"/>} title="Interactive Visualizations">
                            Step-by-step algorithm animations with intuitive controls to see complex processes in action.
                        </FeatureHighlightCard>
                        <FeatureHighlightCard icon={<CodeIcon className="w-6 h-6"/>} title="Accurate & Clear">
                            Simulations backed by robust logic for accuracy, presented with a clean and clear frontend.
                        </FeatureHighlightCard>
                        <FeatureHighlightCard icon={<GraduationCapIcon className="w-6 h-6"/>} title="Educational Excellence">
                            Each module combines theory, practical examples, and simulation in one integrated experience.
                        </FeatureHighlightCard>
                        <FeatureHighlightCard icon={<ShieldCheckIcon className="w-6 h-6"/>} title="Professional Quality">
                            A dark theme IDE aesthetic that's easy on the eyes for extended learning sessions.
                        </FeatureHighlightCard>
                        <FeatureHighlightCard icon={<DatabaseIcon className="w-6 h-6"/>} title="Comprehensive Coverage">
                            Over {stats.algorithms}+ algorithms across {stats.categories} computer science domains, and constantly growing.
                        </FeatureHighlightCard>
                        <FeatureHighlightCard icon={<LockIcon className="w-6 h-6"/>} title="Zero Code Execution">
                            A safe, secure learning environment that runs entirely in your browser with no backend execution.
                        </FeatureHighlightCard>
                    </motion.div>
                </motion.section>
                
                {/* Algorithm Categories */}
                <motion.section
                     variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                >
                     <h2 className="text-3xl font-bold text-center text-text-primary mb-12">Explore Our Algorithm Universe</h2>
                     <motion.div 
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                     >
                        {categories.map(category => (
                            <AlgorithmCategoryCard 
                                key={category}
                                icon={React.cloneElement(categoryIcons[category], { className: "w-8 h-8"})}
                                title={category}
                                algorithms={groupedAlgorithms[category]}
                                description={categoryDescriptions[category] || "Explore this category"}
                            />
                        ))}
                     </motion.div>
                </motion.section>

                {/* Team Section */}
                <motion.section
                     variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
                     className="text-center"
                >
                    <h2 className="text-3xl font-bold text-text-primary mb-4">Built by Algorithm Enthusiasts</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        This platform is developed and maintained by a team with a passion for education and technology, committed to accuracy, quality, and continuous improvement to create the best possible learning experience.
                    </p>
                </motion.section>

            </div>
        </main>
    );
};

export default AboutPage;
