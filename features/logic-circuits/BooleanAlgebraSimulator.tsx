import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { simplifyMinterms } from '../../services/booleanAlgebraService';

const BooleanAlgebraSimulator: React.FC = () => {
    const [numVars, setNumVars] = useState<string>('4');
    const [minterms, setMinterms] = useState<string>('0, 2, 5, 6, 7, 8, 10, 13, 15');
    const [result, setResult] = useState<{ steps: string[], finalExpression: string } | null>(null);
    const [error, setError] = useState<string>('');

    const handleSimplify = () => {
        const vars = parseInt(numVars);
        if (isNaN(vars) || vars < 2 || vars > 8) {
            setError("Number of variables must be between 2 and 8.");
            return;
        }
        const mintermList = minterms.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
        if (mintermList.some(m => m >= Math.pow(2, vars))) {
            setError(`Minterms cannot be greater than ${Math.pow(2, vars) - 1} for ${vars} variables.`);
            return;
        }
        setError('');
        const simplificationResult = simplifyMinterms(vars, mintermList);
        setResult(simplificationResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Input (Quine-McCluskey)">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Number of Variables</label>
                            <Input value={numVars} onChange={e => setNumVars(e.target.value)} type="number" min="2" max="8" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Minterms (comma-separated)</label>
                            <textarea
                                value={minterms}
                                onChange={e => setMinterms(e.target.value)}
                                className="w-full h-24 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                                placeholder="e.g., 0, 1, 4, 5"
                            />
                        </div>
                        <Button onClick={handleSimplify} className="w-full">Simplify Expression</Button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </div>
                </Card>
                {result && (
                    <Card title="Simplified Expression" className="mt-6">
                        <p className="font-mono text-2xl text-accent-primary text-center break-all">
                            {result.finalExpression}
                        </p>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Simplification Steps">
                    <div className="h-[450px] overflow-y-auto bg-background-elevated p-4 rounded-md">
                        {result ? (
                            <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap">{result.steps.join('\n')}</pre>
                        ) : (
                            <p className="text-text-tertiary">Simplification steps will appear here.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BooleanAlgebraSimulator;