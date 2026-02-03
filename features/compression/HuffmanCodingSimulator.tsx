
import React, { useState, useCallback, useEffect } from 'react';
import { getHuffmanSimulation } from '../../services/huffmanService';
import type { AlgorithmSimulation, AlgorithmStep, HuffmanNode } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const HuffmanNodeComponent: React.FC<{ node: HuffmanNode }> = ({ node }) => {
    return (
        <div className="flex flex-col items-center p-2">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background-elevated border border-border rounded-md p-2 text-center"
            >
                <div className="font-mono text-sm">{node.char === ' ' ? '[space]' : (node.char || 'Internal')}</div>
                <div className="text-xs text-text-tertiary">{node.freq}</div>
            </motion.div>
            { (node.left || node.right) && (
                <div className="flex mt-4">
                    {node.left && <div className="pr-4 border-r border-border"><HuffmanNodeComponent node={node.left} /></div>}
                    {node.right && <div className="pl-4"><HuffmanNodeComponent node={node.right} /></div>}
                </div>
            )}
        </div>
    );
};

const HuffmanCodingSimulator: React.FC = () => {
    const [text, setText] = useState<string>('huffman coding example');
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    
    const runSimulation = useCallback(() => {
        if (text.length > 0) {
            const simData = getHuffmanSimulation(text);
            setSimulation(simData);
            setCurrentStep(0);
        }
    }, [text]);

    useEffect(() => { runSimulation() }, [runSimulation]);

    const handleStep = (direction: number) => {
        if (!simulation) return;
        setCurrentStep(prev => Math.max(0, Math.min(simulation.steps.length - 1, prev + direction)));
    };
    
    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="Huffman Tree Visualization">
                    <div className="min-h-[400px] flex items-center justify-center p-4 overflow-x-auto">
                        {stepData?.state.tree && <HuffmanNodeComponent node={stepData.state.tree} />}
                    </div>
                     <div className="p-4 border-t border-border mt-4">
                        <p className="text-sm text-center font-mono text-text-secondary h-5">{stepData?.description}</p>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card title="Controls">
                     <div className="space-y-4">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-24 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            placeholder="Enter text to compress..."
                        />
                        <Button onClick={runSimulation} className="w-full">Generate Tree</Button>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                <Card title="Frequency / Codes">
                    <div className="font-mono text-sm space-y-2 h-64 overflow-y-auto">
                        {stepData?.state.codes ? 
                            Object.entries(stepData.state.codes).map(([char, code]) => (
                                <div key={char} className="flex justify-between">
                                    <span>'{char === ' ' ? '_': char}'</span>
                                    <span className="text-accent-primary">{code as string}</span>
                                </div>
                            )) :
                            stepData?.state.frequencies && Object.entries(stepData.state.frequencies).map(([char, freq]) => (
                                <div key={char} className="flex justify-between">
                                    <span>'{char === ' ' ? '_' : char}'</span>
                                    <span>{freq as number}</span>
                                </div>
                            ))
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HuffmanCodingSimulator;
