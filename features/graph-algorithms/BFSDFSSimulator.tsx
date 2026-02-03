
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getBfsDfsSimulation } from '../../services/bfsDfsService';
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const defaultNodes: GraphNode[] = [
    { id: 'A', x: 50, y: 150 }, { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 200, y: 250 }, { id: 'D', x: 350, y: 150 },
    { id: 'E', x: 500, y: 50 }, { id: 'F', x: 500, y: 250 },
];
const defaultEdges: GraphEdge[] = [
    { source: 'A', target: 'B', weight: 1 }, { source: 'A', target: 'C', weight: 1 },
    { source: 'B', target: 'D', weight: 1 }, { source: 'C', target: 'D', weight: 1 },
    { source: 'D', target: 'E', weight: 1 }, { source: 'D', target: 'F', weight: 1 },
];

const BFSDFSSimulator: React.FC = () => {
    const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs');
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const runSimulation = useCallback(() => {
        const simData = getBfsDfsSimulation(defaultNodes, defaultEdges, 'A', mode);
        setSimulation(simData);
        setCurrentStep(0);
    }, [mode]);

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
                <Card title={`Graph Traversal - ${mode.toUpperCase()}`}>
                    <div className="relative w-full h-[400px]">
                        <svg width="100%" height="100%" viewBox="0 0 550 300">
                            {defaultEdges.map((edge, i) => {
                                const sourceNode = nodeMap[edge.source];
                                const targetNode = nodeMap[edge.target];
                                return (
                                <g key={i}>
                                    <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} stroke="#374151" strokeWidth="2" />
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
                        <div className="flex space-x-2">
                            <Button onClick={() => setMode('bfs')} className="w-full" variant={mode === 'bfs' ? 'primary' : 'secondary'}>BFS</Button>
                            <Button onClick={() => setMode('dfs')} className="w-full" variant={mode === 'dfs' ? 'primary' : 'secondary'}>DFS</Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                <Card title={mode === 'bfs' ? 'Queue (FIFO)' : 'Stack (LIFO)'}>
                    <div className="font-mono text-sm space-y-1 h-32 overflow-y-auto">
                        {stepData?.state.structure.map((nodeId: string, i: number) => (
                           <div key={i} className="bg-background-elevated p-2 rounded-md text-center">{nodeId}</div>
                        ))}
                         {stepData?.state.structure.length === 0 && <p className="text-text-tertiary text-center">Empty</p>}
                    </div>
                </Card>
                 <Card title="Visited Set">
                    <div className="font-mono text-sm h-24 overflow-y-auto p-2 bg-background-elevated rounded-md flex flex-wrap gap-2">
                        {stepData?.state.visited.map((nodeId: string, i: number) => (
                           <div key={i} className="bg-accent-success/20 text-accent-success px-2 py-1 rounded-md">{nodeId}</div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BFSDFSSimulator;
