
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { cykParse } from '../../services/cfgService';

const CFGSimulator: React.FC = () => {
    const [grammarInput, setGrammarInput] = useState('S -> AB | BC\nA -> BA | a\nB -> CC | b\nC -> AB | a');
    const [stringInput, setStringInput] = useState('baaba');
    const [result, setResult] = useState<{table: string[][], isAccepted: boolean} | null>(null);
    const [error, setError] = useState('');

    const handleParse = () => {
        try {
            setError('');
            const res = cykParse(grammarInput, stringInput);
            setResult(res);
        } catch (e: any) {
            setError(e.message);
            setResult(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                 <Card title="Grammar (Chomsky Normal Form)">
                     <textarea
                        value={grammarInput}
                        onChange={e => setGrammarInput(e.target.value)}
                        className="w-full h-32 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary"
                        placeholder="S -> AB | a"
                    />
                 </Card>
                 <Card title="Input String">
                    <div className="flex space-x-2">
                        <Input value={stringInput} onChange={e => setStringInput(e.target.value)} className="font-mono" />
                        <Button onClick={handleParse}>Parse</Button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                 </Card>
                 {result && (
                     <Card title="Result">
                        <div className={`p-4 rounded-md text-center ${result.isAccepted ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                            <h3 className="font-bold text-lg">
                                String "{stringInput}" is {result.isAccepted ? 'Accepted' : 'Rejected'}
                            </h3>
                        </div>
                    </Card>
                 )}
            </div>
            <div className="lg:col-span-1">
                <Card title="CYK Parsing Table">
                    <div className="overflow-x-auto">
                        <table className="w-full font-mono text-sm text-center">
                            <tbody>
                                {result?.table.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="border border-border p-2 h-12 w-12">
                                                {`{${cell || ' '}}`}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CFGSimulator;
