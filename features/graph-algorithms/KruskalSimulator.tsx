
import React, { useState, useEffect, useCallback } from 'react';
import { getKruskalSimulation } from '../../services/kruskalService';
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const defaultNodes: GraphNode[] = [
    { id: 'A', x: 50, y: 50 }, { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 350, y: 50 }, { id: 'D', x: 50, y: 200 },
    { id: 'E', x: 200, y: 200 }, { id: 'F', x: 350, y: 200 },
];
const defaultEdges: GraphEdge[] = [
    { source: 'A', target: 'B', weight: 3 }, { source: 'A', target: 'D', weight: 2 },
    { source: 'B', target: 'C', weight: 4 }, { source: 'B', target: 'E', weight: 1 },
    { source: 'C', target: 'F', weight: 6 }, { source: 'D', target: 'E', weight: 5 },
    { source: 'E', target: 'F', weight: 7 }, { source: 'B', target: 'D', weight: 2 },
];

const KruskalSimulator: React.FC = () => {
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const runSimulation = useCallback(() => {
        const simData = getKruskalSimulation(defaultNodes, defaultEdges);
        setSimulation(simData);
        setCurrentStep(0);
    }, []);

    useEffect(() => { runSimulation(); }, [runSimulation]);

    const handleStep = (direction: number) => {
        if (!simulation) return;
        setCurrentStep(prev => Math.max(0, Math.min(simulation.steps.length - 1, prev + direction)));
    };

    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;
    const nodeMap = React.useMemo(() => defaultNodes.reduce((acc, node) => ({...acc, [node.id]: node}), {} as Record<string, GraphNode>), []);
    const edgeMap = React.useMemo(() => defaultEdges.reduce((acc, edge, i) => ({...acc, [`${edge.source}-${edge.target}`]: edge, [`${edge.target}-${edge.source}`]: edge }), {}), []);
    
    const getEdgeColor = (edge: GraphEdge) => {
        const edgeId1 = `${edge.source}-${edge.target}`;
        const edgeId2 = `${edge.target}-${edge.source}`;
        if (stepData?.state.mstEdges.some((e: GraphEdge) => (e.source === edge.source && e.target === edge.target))) return 'stroke-accent-success';
        if (stepData?.state.currentEdge && stepData.state.currentEdge.source === edge.source && stepData.state.currentEdge.target === edge.target) {
            return stepData.state.status === 'rejected' ? 'stroke-accent-warning' : 'stroke-accent-primary';
        }
        return 'stroke-border';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="MST Construction">
                    <div className="relative w-full h-[400px]">
                        <svg width="100%" height="100%" viewBox="0 0 400 250">
                            {defaultEdges.map((edge, i) => {
                                const sourceNode = nodeMap[edge.source];
                                const targetNode = nodeMap[edge.target];
                                return (
                                <g key={i}>
                                    <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} className={getEdgeColor(edge)} strokeWidth="3" />
                                    <text x={(sourceNode.x + targetNode.x) / 2 + 5} y={(sourceNode.y + targetNode.y) / 2 - 5} fill="#9ca3af" fontSize="12">{edge.weight}</text>
                                </g>
                                );
                            })}
                            {defaultNodes.map(node => (
                                <g key={node.id}>
                                    <circle cx={node.x} cy={node.y} r="15" fill="bg-background-elevated" stroke="#9ca3af" strokeWidth="2" />
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
                        <Button onClick={runSimulation} className="w-full">Reset Simulation</Button>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                <Card title="Metrics">
                     {stepData && (
                        <div className="font-mono text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Edges in MST:</span>
                                <span className="text-text-primary">{stepData.state.mstEdges.length} / {defaultNodes.length - 1}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-text-tertiary">Total Weight:</span>
                                <span className="text-accent-primary">{stepData.metrics.totalWeight}</span>
                            </div>
                        </div>
                    )}
                </Card>
                <Card title="Sorted Edges">
                    <div className="font-mono text-sm space-y-1 h-48 overflow-y-auto">
                        {simulation?.steps[0].state.sortedEdges.map((edge: GraphEdge, i: number) => (
                           <div key={i} className={`p-2 rounded-md ${stepData?.state.currentEdgeIndex === i ? 'bg-accent-primary/20' : 'bg-background-elevated'}`}>
                                {`(${edge.source}, ${edge.target}) - Weight: ${edge.weight}`}
                           </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default KruskalSimulator;
