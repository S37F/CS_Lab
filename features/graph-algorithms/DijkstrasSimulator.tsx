
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDijkstraSimulation } from '../../services/dijkstraService';
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const defaultNodes: GraphNode[] = [
    { id: 'A', x: 50, y: 150 }, { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 200, y: 250 }, { id: 'D', x: 350, y: 50 },
    { id: 'E', x: 350, y: 250 }, { id: 'F', x: 500, y: 150 },
];
const defaultEdges: GraphEdge[] = [
    { source: 'A', target: 'B', weight: 4 }, { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 }, { source: 'C', target: 'B', weight: 1 },
    { source: 'C', target: 'E', weight: 8 }, { source: 'C', target: 'D', weight: 8 },
    { source: 'D', target: 'E', weight: 2 }, { source: 'D', target: 'F', weight: 6 },
    { source: 'E', target: 'F', weight: 1 },
];

const DijkstrasSimulator: React.FC = () => {
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const runSimulation = useCallback(() => {
        const simData = getDijkstraSimulation(defaultNodes, defaultEdges, 'A');
        setSimulation(simData);
        setCurrentStep(0);
    }, []);

    useEffect(() => { runSimulation(); }, [runSimulation]);

    const handleStep = (direction: number) => {
        if (!simulation) return;
        setCurrentStep(prev => Math.max(0, Math.min(simulation.steps.length - 1, prev + direction)));
    };

    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;
    const nodeMap = useMemo(() => defaultNodes.reduce((acc, node) => ({...acc, [node.id]: node}), {} as Record<string, GraphNode>), []);

    const getNodeColor = (nodeId: string) => {
        if(stepData?.state.currentNode === nodeId) return 'fill-accent-primary';
        if(stepData?.state.visited.includes(nodeId)) return 'fill-accent-success';
        return 'fill-background-elevated';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="Graph Visualization">
                    <div className="relative w-full h-[400px]">
                        <svg width="100%" height="100%" viewBox="0 0 550 300">
                            {defaultEdges.map((edge, i) => {
                                const sourceNode = nodeMap[edge.source];
                                const targetNode = nodeMap[edge.target];
                                return (
                                <g key={i}>
                                    <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} stroke="#374151" strokeWidth="2" />
                                    <text x={(sourceNode.x + targetNode.x) / 2 + 5} y={(sourceNode.y + targetNode.y) / 2 - 5} fill="#9ca3af" fontSize="12">{edge.weight}</text>
                                </g>
                                );
                            })}
                            {defaultNodes.map(node => (
                                <g key={node.id}>
                                    <motion.circle cx={node.x} cy={node.y} r="20" className={getNodeColor(node.id)} stroke="#9ca3af" strokeWidth="2"
                                        animate={{ scale: stepData?.state.currentNode === node.id ? 1.2 : 1 }}
                                    />
                                    <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ffffff" fontWeight="bold">{node.id}</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                     <div className="p-4 border-t border-border mt-4">
                        <p className="text-sm text-center font-mono text-text-secondary h-5">{stepData?.description}</p>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="Controls">
                     <div className="space-y-4">
                        <p className="text-sm text-text-secondary">Step through the algorithm to see how it finds the shortest path from the start node 'A'.</p>
                        <Button onClick={runSimulation} className="w-full">Reset Simulation</Button>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                <Card title="Distances">
                    <div className="font-mono text-sm space-y-2 h-64 overflow-y-auto">
                        {stepData?.state.distances && Object.entries(stepData.state.distances).map(([node, distance]) => (
                            <div key={node} className="flex justify-between">
                                <span className={stepData?.state.updated === node ? "text-yellow-400" : ""}>Node {node}:</span>
                                <span className={stepData?.state.updated === node ? "text-yellow-400 font-bold" : ""}>{distance === Infinity ? '∞' : distance as number}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DijkstrasSimulator;
