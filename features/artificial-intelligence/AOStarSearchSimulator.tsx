import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, RefreshIcon } from '../../components/Icons';

type NodeType = 'AND' | 'OR';

interface Node {
    id: string;
    type: NodeType;
    cost: number;
    h: number;
    isSolved?: boolean;
    isGoal?: boolean;
    children?: string[];
    parent?: string;
    level?: number;
    x?: number;
    y?: number;
}

const initialNodes: { [key: string]: Node } = {
    'A': { id: 'A', type: 'OR', cost: 1, h: 5, children: ['B', 'C', 'D'] },
    'B': { id: 'B', type: 'AND', cost: 1, h: 2, children: ['E', 'F'] },
    'C': { id: 'C', type: 'OR', cost: 1, h: 3, children: ['G'] },
    'D': { id: 'D', type: 'AND', cost: 1, h: 4, children: ['H', 'I'] },
    'E': { id: 'E', type: 'OR', cost: 5, h: 0, isGoal: true },
    'F': { id: 'F', type: 'OR', cost: 2, h: 0, isGoal: true },
    'G': { id: 'G', type: 'OR', cost: 2, h: 0, isGoal: true },
    'H': { id: 'H', type: 'OR', cost: 1, h: 0, isGoal: true },
    'I': { id: 'I', type: 'OR', cost: 8, h: 0, isGoal: true },
};

const AOStarSearchSimulator: React.FC = () => {
    const [nodes, setNodes] = useState<{ [key: string]: Node }>(JSON.parse(JSON.stringify(initialNodes)));
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [message, setMessage] = useState("Ready to solve.");

    const layoutNodes = (rootId: string) => {
        const newNodes = { ...nodes };
        const levels: { [key: number]: string[] } = {};

        const setLevels = (nodeId: string, level: number) => {
            if (!newNodes[nodeId]) return;
            newNodes[nodeId].level = level;
            if (!levels[level]) levels[level] = [];
            levels[level].push(nodeId);

            newNodes[nodeId].children?.forEach(childId => {
                newNodes[childId].parent = nodeId;
                setLevels(childId, level + 1);
            });
        };

        setLevels(rootId, 0);

        const canvasWidth = 600;
        const canvasHeight = 400;

        Object.keys(levels).forEach(levelStr => {
            const level = parseInt(levelStr);
            const levelNodes = levels[level];
            const y = (level * (canvasHeight / (Object.keys(levels).length))) + 50;
            levelNodes.forEach((nodeId, i) => {
                const x = (i + 1) * (canvasWidth / (levelNodes.length + 1));
                newNodes[nodeId].x = x;
                newNodes[nodeId].y = y;
            });
        });
        return newNodes;
    };
    
    const [laidOutNodes, setLaidOutNodes] = useState(() => layoutNodes('A'));

    const reset = useCallback(() => {
        const freshNodes = JSON.parse(JSON.stringify(initialNodes));
        setNodes(freshNodes);
        setLaidOutNodes(layoutNodes('A'));
        setCurrentPath([]);
        setMessage("Ready to solve.");
    }, []);

    const solve = async () => {
        setMessage("Solving...");
        let open = ['A'];
        const closed = new Set<string>();
        const path: string[] = [];

        const updateCost = (nodeId: string): number => {
            const node = laidOutNodes[nodeId];
            if (!node.children) {
                node.isSolved = true;
                return node.h;
            }

            if (node.type === 'AND') {
                let totalCost = node.children.reduce((acc, childId) => acc + updateCost(childId), 0);
                node.h = totalCost + node.children.length * node.cost;
            } else { // OR
                node.h = Math.min(...node.children.map(childId => updateCost(childId) + node.cost));
            }
            
            const allChildrenSolved = node.children.every(childId => laidOutNodes[childId].isSolved);
            if(allChildrenSolved) node.isSolved = true;

            return node.h;
        };
        
        updateCost('A');

        // Simplified traversal for visualization
        const traverse = async (nodeId: string) => {
            if(!nodeId || closed.has(nodeId)) return;
            
            path.push(nodeId);
            setCurrentPath([...path]);
            closed.add(nodeId);
            
            await new Promise(r => setTimeout(r, 500));

            const node = laidOutNodes[nodeId];
            if(node.isGoal) {
                node.isSolved = true;
                return;
            }

            if(node.children) {
                if(node.type === 'OR') {
                    let bestChild: string | null = null;
                    let minCost = Infinity;
                    for(const childId of node.children) {
                        const childCost = laidOutNodes[childId].h + laidOutNodes[childId].cost;
                        if(childCost < minCost) {
                            minCost = childCost;
                            bestChild = childId;
                        }
                    }
                    if(bestChild) await traverse(bestChild);
                } else { // AND
                    for(const childId of node.children) {
                        await traverse(childId);
                    }
                }
            }
        };

        await traverse('A');
        setMessage(`Solved! Minimum cost: ${laidOutNodes['A'].h}`);
    };


    return (
        <Card>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-text-secondary">{message}</div>
                    <div className="flex space-x-2">
                        <Button onClick={solve} variant="primary" size="sm"><PlayIcon className="w-4 h-4" /></Button>
                        <Button onClick={reset} variant="secondary" size="sm"><RefreshIcon className="w-4 h-4" /></Button>
                    </div>
                </div>
                <svg width="100%" height="400" className="bg-background-secondary rounded-md">
                    <AnimatePresence>
                        {Object.values(laidOutNodes).map(node => (
                            node.parent && laidOutNodes[node.parent] &&
                            <motion.line
                                key={`line-${node.parent}-${node.id}`}
                                x1={laidOutNodes[node.parent]!.x}
                                y1={laidOutNodes[node.parent]!.y}
                                x2={node.x}
                                y2={node.y}
                                stroke={currentPath.includes(node.id) ? "#34D399" : "#4B5563"}
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        ))}
                        {Object.values(laidOutNodes).map(node => (
                            <motion.g key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="20"
                                    fill={currentPath.includes(node.id) ? (node.isSolved ? "#10B981" : "#3B82F6") : "#1F2937"}
                                    stroke={node.isGoal ? "#F59E0B" : "#6B7280"}
                                    strokeWidth="2"
                                />
                                <text x={node.x} y={node.y ? node.y + 5 : 0} textAnchor="middle" fill="white" fontSize="12">
                                    {node.id}
                                </text>
                                <text x={node.x} y={node.y ? node.y - 25 : 0} textAnchor="middle" fill="#9CA3AF" fontSize="10">
                                    h={node.h}
                                </text>
                                {node.type === 'AND' && node.children && node.children.length > 0 && (
                                    <path d={`M ${node.x! - 10},${node.y! + 20} C ${node.x! - 10},${node.y! + 30} ${node.x! + 10},${node.y! + 30} ${node.x! + 10},${node.y! + 20}`} stroke="#6B7280" strokeWidth="2" fill="none" />
                                )}
                            </motion.g>
                        ))}
                    </AnimatePresence>
                </svg>
            </div>
        </Card>
    );
};

export default AOStarSearchSimulator;
