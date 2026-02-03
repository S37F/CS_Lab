
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { solveKmap } from '../../services/kmapService';

const KMapSimulator: React.FC = () => {
    const [numVars, setNumVars] = useState<2 | 3 | 4>(4);
    const [minterms, setMinterms] = useState<string>('0, 2, 5, 7, 8, 10, 13, 15');
    const [result, setResult] = useState<{ expression: string; groups: { term: string; cells: number[] }[] } | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        handleSolve();
    }, [numVars, minterms]);

    const handleSolve = () => {
        const mintermList = minterms.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
        if (mintermList.some(m => m >= Math.pow(2, numVars))) {
            setError(`Minterms must be < ${Math.pow(2, numVars)} for ${numVars} variables.`);
            return;
        }
        setError('');
        const solveResult = solveKmap(numVars, mintermList);
        setResult(solveResult);
    };

    const toggleMinterm = (index: number) => {
        const mintermList = minterms.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
        const set = new Set(mintermList);
        if (set.has(index)) {
            set.delete(index);
        } else {
            set.add(index);
        }
        const newMinterms = Array.from(set).sort((a: number, b: number) => a - b).join(', ');
        setMinterms(newMinterms);
    };

    const mapLayouts = {
        2: { grid: 'grid-cols-2', labels: ['0', '1'], cells: [0, 1, 2, 3]},
        3: { grid: 'grid-cols-4', labels: ['00', '01', '11', '10'], cells: [0, 1, 3, 2, 4, 5, 7, 6]},
        4: { grid: 'grid-cols-4', labels: ['00', '01', '11', '10'], cells: [0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10]}
    };
    const layout = mapLayouts[numVars];
    const mintermSet = new Set(minterms.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m)));

    const groupColors = ['border-accent-primary', 'border-accent-success', 'border-accent-warning', 'border-purple-500', 'border-pink-500'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Karnaugh Map">
                    <div className="relative p-8">
                         <div className={`grid ${layout.grid} gap-1`}>
                            {layout.cells.map((cellIndex, i) => (
                                <button key={i} onClick={() => toggleMinterm(cellIndex)} className="w-16 h-16 bg-background-elevated border border-border flex items-center justify-center text-xl font-bold hover:bg-border transition-colors">
                                    {mintermSet.has(cellIndex) ? '1' : '0'}
                                    <span className="absolute top-0 left-0 text-xs text-text-tertiary">{cellIndex}</span>
                                </button>
                            ))}
                        </div>
                        {result?.groups.map((group, gIndex) => {
                            // Find bounding box of cells
                            const groupCells = group.cells.map(c => layout.cells.indexOf(c));
                            const rows = groupCells.map(c => Math.floor(c / (layout.grid === 'grid-cols-2' ? 2: 4)));
                            const cols = groupCells.map(c => c % (layout.grid === 'grid-cols-2' ? 2: 4));
                            const minRow = Math.min(...rows);
                            const maxRow = Math.max(...rows);
                            const minCol = Math.min(...cols);
                            const maxCol = Math.max(...cols);
                            
                            // Simple bounding box for non-wrapping groups
                            return <div key={gIndex} className={`absolute border-2 ${groupColors[gIndex % groupColors.length]} rounded-md pointer-events-none`} style={{
                                top: `${minRow * 4.25 + 1.5}rem`,
                                left: `${minCol * 4.25 + 1.5}rem`,
                                width: `${(maxCol - minCol + 1) * 4.25 - 0.5}rem`,
                                height: `${(maxRow - minRow + 1) * 4.25 - 0.5}rem`,
                            }}></div>
                        })}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="Controls">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Number of Variables</label>
                             <div className="flex space-x-2">
                                <Button className="w-full" variant={numVars === 2 ? 'primary' : 'secondary'} onClick={() => setNumVars(2)}>2</Button>
                                <Button className="w-full" variant={numVars === 3 ? 'primary' : 'secondary'} onClick={() => setNumVars(3)}>3</Button>
                                <Button className="w-full" variant={numVars === 4 ? 'primary' : 'secondary'} onClick={() => setNumVars(4)}>4</Button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Minterms (comma-separated)</label>
                            <Input value={minterms} onChange={(e) => setMinterms(e.target.value)} />
                        </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </Card>
                 <Card title="Simplified Expression (SOP)">
                     <p className="font-mono text-xl text-accent-primary text-center break-all">
                        {result?.expression || '...'}
                     </p>
                </Card>
            </div>
        </div>
    );
};

export default KMapSimulator;
