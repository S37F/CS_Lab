import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getBellmanFordSimulation } from '../../services/bellmanFordService';
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const defaultNodes: GraphNode[] = [
    { id: 'S', x: 50, y: 150 }, { id: 'A', x: 200, y: 50 },
    { id: 'B', x: 200, y: 250 }, { id: 'C', x: 350, y: 50 },
    { id: 'D', x: 350, y: 250 }, { id: 'E', x: 500, y: 150 },
];
const defaultEdges: GraphEdge[] = [
    { source: 'S', target: 'A', weight: 10 }, { source: 'S', target: 'E', weight: 8 },
    { source: 'A', target: 'C', weight: 2 }, { source: 'B', target: 'A', weight: 1 },
    { source: 'C', target: 'B', weight: -2 }, { source: 'D', target: 'C', weight: -1 },
    { source: 'D', target: 'A', weight: -4 }, { source: 'E', target: 'D', weight: 1 },
];

const BellmanFordSimulator: React.FC = () => {
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const runSimulation = useCallback(() => {
        const simData = getBellmanFordSimulation(defaultNodes, defaultEdges, 'S');
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

    const getEdgeColor = (edge: GraphEdge) => {
        const currentEdge = stepData?.state.relaxingEdge;
        if (currentEdge && currentEdge.source === edge.source && currentEdge.target === edge.target) {
            return stepData.state.updated ? 'stroke-yellow-400' : 'stroke-accent-primary';
        }
        return 'stroke-border';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg-col-span-2">
                <Card title="Graph Visualization">
                    <div className="relative w-full h-[400px]">
                        <svg width="100%" height="100%" viewBox="0 0 550 300">
                            {defaultEdges.map((edge, i) => {
                                const sourceNode = nodeMap[edge.source];
                                const targetNode = nodeMap[edge.target];
                                return (
                                <g key={i}>
                                    <defs>
                                        <marker id={`arrow-${i}`} markerWidth="10" markerHeight="7" refX="8" refY="1.75" orient="auto"><polygon points="0 0, 2.5 1.75, 0 3.5" fill="#9ca3af"/></marker>
                                    </defs>
                                    <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} className={getEdgeColor(edge)} strokeWidth="2" markerEnd={`url(#arrow-${i})`} />
                                    <text x={(sourceNode.x + targetNode.x) / 2 + 5} y={(sourceNode.y + targetNode.y) / 2 - 5} fill="#9ca3af" fontSize="12">{edge.weight}</text>
                                </g>
                                );
                            })}
                            {defaultNodes.map(node => (
                                <g key={node.id}>
                                    <circle cx={node.x} cy={node.y} r="20" className="fill-background-elevated" stroke="#9ca3af" strokeWidth="2" />
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
            <div className="lg-col-span-1 space-y-6">
                <Card title="Controls">
                     <div className="space-y-4">
                        <Button onClick={runSimulation} className="w-full">Reset Simulation</Button>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                <Card title="Distances from Source 'S'">
                    <div className="font-mono text-sm space-y-2 h-64 overflow-y-auto">
                        <p className="font-bold text-text-tertiary">Iteration: {stepData?.state.iteration ?? 0}</p>
                        {stepData?.state.distances && Object.entries(stepData.state.distances).map(([node, distance]) => (
                            <div key={node} className={`flex justify-between p-1 rounded ${stepData.state.updatedNode === node ? 'bg-yellow-400/20' : ''}`}>
                                <span className={stepData.state.updatedNode === node ? "text-yellow-400" : ""}>Node {node}:</span>
                                <span className={stepData.state.updatedNode === node ? "text-yellow-400 font-bold" : ""}>{distance === Infinity ? '∞' : distance as number}</span>
                            </div>
                        ))}
                         {stepData?.state.negativeCycle && <p className="text-red-500 font-bold mt-4">Negative weight cycle detected!</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BellmanFordSimulator;