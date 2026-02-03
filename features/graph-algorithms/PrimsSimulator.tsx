import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getPrimsSimulation } from '../../services/primsService';
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const defaultNodes: GraphNode[] = [
    { id: 'A', x: 50, y: 150 }, { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 200, y: 250 }, { id: 'D', x: 350, y: 50 },
    { id: 'E', x: 350, y: 250 }, { id: 'F', x: 500, y: 150 },
];
const defaultEdges: GraphEdge[] = [
    { source: 'A', target: 'B', weight: 4 }, { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 }, { source: 'C', target: 'B', weight: 1 },
    { source: 'C', target: 'E', weight: 8 }, { source: 'D', target: 'E', weight: 2 },
    { source: 'D', target: 'F', weight: 6 }, { source: 'E', target: 'F', weight: 1 },
];

const PrimsSimulator: React.FC = () => {
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const runSimulation = useCallback(() => {
        const simData = getPrimsSimulation(defaultNodes, defaultEdges, 'A');
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
        if(stepData?.state.mstNodes.includes(nodeId)) return 'fill-accent-success';
        return 'fill-background-elevated';
    }

    const getEdgeColor = (edge: GraphEdge) => {
        const isInMst = stepData?.state.mstEdges.some((e: GraphEdge) => (e.source === edge.source && e.target === edge.target) || (e.source === edge.target && e.target === edge.source));
        if (isInMst) return 'stroke-accent-success';
        
        const isConsidered = stepData?.state.edgeQueue.some((e: GraphEdge) => (e.source === edge.source && e.target === edge.target) || (e.source === edge.target && e.target === edge.source));
        if (isConsidered) return 'stroke-accent-primary';
        
        return 'stroke-border';
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card title="MST Construction (Prim's)">
                    <div className="relative w-full h-[400px]">
                        <svg width="100%" height="100%" viewBox="0 0 550 300">
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
                                    <circle cx={node.x} cy={node.y} r="20" className={getNodeColor(node.id)} stroke="#9ca3af" strokeWidth="2" />
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
                            <div className="flex justify-between font-bold">
                                <span className="text-text-tertiary">Total Weight:</span>
                                <span className="text-accent-primary">{stepData.metrics.totalWeight}</span>
                            </div>
                        </div>
                    )}
                </Card>
                <Card title="Edge Priority Queue">
                    <div className="font-mono text-sm space-y-1 h-48 overflow-y-auto">
                        {stepData?.state.edgeQueue.map((edge: GraphEdge, i: number) => (
                           <div key={i} className={`p-2 rounded-md ${i === 0 ? 'bg-accent-primary/20' : 'bg-background-elevated'}`}>
                                {`(${edge.source}, ${edge.target}) - Weight: ${edge.weight}`}
                           </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PrimsSimulator;