import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getBankerSimulation } from '../../services/bankersAlgorithmService';
import type { BankerProcessInfo } from '../../types';

const BankersAlgorithmSimulator: React.FC = () => {
    const [numResources, setNumResources] = useState(3);
    const [available, setAvailable] = useState<number[]>([3, 3, 2]);
    const [processes, setProcesses] = useState<BankerProcessInfo[]>([
        { id: 0, allocation: [0, 1, 0], max: [7, 5, 3], need: [] },
        { id: 1, allocation: [2, 0, 0], max: [3, 2, 2], need: [] },
        { id: 2, allocation: [3, 0, 2], max: [9, 0, 2], need: [] },
        { id: 3, allocation: [2, 1, 1], max: [2, 2, 2], need: [] },
        { id: 4, allocation: [0, 0, 2], max: [4, 3, 3], need: [] },
    ]);
    const [simulation, setSimulation] = useState<{ isSafe: boolean; safeSequence: number[]; steps: string[] } | null>(null);

    const processesWithNeed = useMemo(() => {
        return processes.map(p => ({
            ...p,
            need: p.max.map((m, i) => m - p.allocation[i])
        }));
    }, [processes]);

    const handleCheckSafety = () => {
        const sim = getBankerSimulation(available, processesWithNeed);
        setSimulation(sim);
    };

    const handleMatrixChange = (procIndex: number, resIndex: number, type: 'allocation' | 'max', value: string) => {
        const val = parseInt(value) || 0;
        const newProcesses = [...processes];
        newProcesses[procIndex][type][resIndex] = val;
        setProcesses(newProcesses);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card title="System State">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Available Resources</label>
                            <div className="flex space-x-2">
                                {available.map((val, i) => (
                                    <input key={i} type="number" value={val} onChange={e => {const newAv = [...available]; newAv[i] = parseInt(e.target.value) || 0; setAvailable(newAv)}} className="w-full bg-background-elevated border border-border rounded-md p-1 text-center font-mono"/>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handleCheckSafety} className="w-full">Check for Safe State</Button>
                         <table className="w-full text-left font-mono text-sm">
                            <thead>
                                <tr>
                                    <th/>
                                    <th colSpan={numResources} className="text-center border-b border-border">Allocation</th>
                                    <th colSpan={numResources} className="text-center border-b border-border">Max</th>
                                    <th colSpan={numResources} className="text-center border-b border-border">Need</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processesWithNeed.map((p, pIndex) => (
                                    <tr key={pIndex}>
                                        <td className="font-bold p-1">P{pIndex}</td>
                                        {p.allocation.map((val, rIndex) => <td key={rIndex}><input type="number" value={val} onChange={e => handleMatrixChange(pIndex, rIndex, 'allocation', e.target.value)} className="w-10 bg-background-elevated border border-border rounded-md p-1 text-center"/></td>)}
                                        {p.max.map((val, rIndex) => <td key={rIndex}><input type="number" value={val} onChange={e => handleMatrixChange(pIndex, rIndex, 'max', e.target.value)} className="w-10 bg-background-elevated border border-border rounded-md p-1 text-center"/></td>)}
                                        {p.need.map((val, rIndex) => <td key={rIndex} className="p-1 text-center">{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                    </div>
                </Card>
            </div>
             <div className="space-y-6">
                <Card title="Safety Algorithm Trace">
                    <div className="h-64 overflow-y-auto bg-background-elevated p-4 rounded-md font-mono text-sm">
                        {simulation ? (
                            simulation.steps.map((step, i) => <p key={i}>{step}</p>)
                        ) : (
                            <p className="text-text-tertiary">Trace will appear here.</p>
                        )}
                    </div>
                </Card>
                {simulation && (
                    <Card title="Result">
                        <div className={`p-4 rounded-md text-center ${simulation.isSafe ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                            <h3 className="font-bold text-lg">
                                {simulation.isSafe ? "System is in a Safe State" : "System is in an Unsafe State"}
                            </h3>
                            {simulation.isSafe && <p className="text-sm mt-1">Safe Sequence: &lt;{simulation.safeSequence.map(p => `P${p}`).join(', ')}&gt;</p>}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BankersAlgorithmSimulator;