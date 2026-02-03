import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { analyzeSerializability } from '../../services/serializabilityService';
import type { TransactionOperation } from '../../types';

const PrecedenceGraph: React.FC<{ transactions: string[], edges: [string, string][] }> = ({ transactions, edges }) => {
    const nodePositions = useMemo(() => {
        const positions: { [key: string]: { x: number, y: number } } = {};
        const radius = 100;
        const center = { x: 150, y: 120 };
        transactions.forEach((t, i) => {
            const angle = (i / transactions.length) * 2 * Math.PI;
            positions[t] = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            };
        });
        return positions;
    }, [transactions]);

    return (
        <svg width="100%" height="250" viewBox="0 0 300 240">
            {edges.map(([u, v], i) => {
                const posU = nodePositions[u];
                const posV = nodePositions[v];
                if (!posU || !posV) return null;
                return (
                    <g key={i}>
                        <defs>
                            <marker id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="8" refY="1.75" orient="auto">
                                <polygon points="0 0, 2.5 1.75, 0 3.5" fill="#f59e0b" />
                            </marker>
                        </defs>
                        <line x1={posU.x} y1={posU.y} x2={posV.x} y2={posV.y} stroke="#f59e0b" strokeWidth="2" markerEnd={`url(#arrowhead-${i})`} />
                    </g>
                );
            })}
            {transactions.map(t => {
                const pos = nodePositions[t];
                if (!pos) return null;
                return (
                    <g key={t}>
                        <circle cx={pos.x} cy={pos.y} r="15" fill="#1a1a1a" stroke="#9ca3af" strokeWidth="2" />
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#ffffff" fontWeight="bold">{t}</text>
                    </g>
                );
            })}
        </svg>
    );
};

const SerializabilitySimulator: React.FC = () => {
    const [scheduleInput, setScheduleInput] = useState('R1(A); R2(A); W1(A); W2(A)');
    const [result, setResult] = useState<{ isSerializable: boolean; conflicts: string[]; graph: { nodes: string[], edges: [string, string][] }; cycle: string[] | null } | null>(null);

    const handleAnalyze = () => {
        const analysisResult = analyzeSerializability(scheduleInput);
        setResult(analysisResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Transaction Schedule">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Schedule (semicolon-separated)</label>
                            <textarea
                                value={scheduleInput}
                                onChange={e => setScheduleInput(e.target.value)}
                                className="w-full h-24 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                                placeholder="e.g., R1(A); W1(A); R2(A); W2(A)"
                            />
                        </div>
                        <Button onClick={handleAnalyze} className="w-full">Analyze for Conflict Serializability</Button>
                    </div>
                </Card>
                {result && (
                    <Card title="Result" className="mt-6">
                        <div className={`p-4 rounded-md text-center ${result.isSerializable ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                            <h3 className="font-bold text-lg">
                                {result.isSerializable ? "Schedule is Conflict-Serializable" : "Schedule is NOT Conflict-Serializable"}
                            </h3>
                            {result.cycle && <p className="text-sm mt-1">Reason: Cycle detected in precedence graph ({result.cycle.join(' -> ')})</p>}
                        </div>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Precedence Graph">
                    <div className="h-[250px]">
                        {result && <PrecedenceGraph transactions={result.graph.nodes} edges={result.graph.edges} />}
                    </div>
                    <div className="border-t border-border mt-4 p-4 h-[150px] overflow-y-auto">
                        <h4 className="font-semibold text-text-primary mb-2">Detected Conflicts:</h4>
                        {result && result.conflicts.length > 0 ? (
                             <ul className="list-disc list-inside text-sm font-mono text-text-secondary">
                                {result.conflicts.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        ) : <p className="text-sm text-text-tertiary">No conflicts found.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SerializabilitySimulator;
