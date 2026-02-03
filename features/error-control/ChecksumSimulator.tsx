
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { calculateChecksum } from '../../services/checksumService';

const ChecksumSimulator: React.FC = () => {
    const [dataInput, setDataInput] = useState<string>('4500\n003c\n1c46\n4000\n4006');
    const [result, setResult] = useState<{ checksum: string; steps: string[] } | null>(null);
    const [error, setError] = useState<string>('');

    const handleCalculate = () => {
        const hexWords = dataInput.split('\n').map(s => s.trim()).filter(Boolean);
        const wordSize = 16;

        // Validation
        for (const word of hexWords) {
            if (!/^[0-9a-fA-F]+$/.test(word) || word.length > wordSize / 4) {
                setError(`Invalid hex word: "${word}". Please use up to 4 hex characters per line.`);
                setResult(null);
                return;
            }
        }
        setError('');
        const checksumResult = calculateChecksum(hexWords, wordSize);
        setResult(checksumResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Input Data">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">16-bit Hex Words (one per line)</label>
                            <textarea
                                value={dataInput}
                                onChange={(e) => setDataInput(e.target.value)}
                                placeholder="e.g. 1234&#10;5678"
                                className="w-full h-32 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            />
                        </div>
                        <Button onClick={handleCalculate} className="w-full">Calculate 16-bit Checksum</Button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </div>
                </Card>
                {result && (
                    <Card title="Result" className="mt-6">
                        <p className="font-mono text-2xl text-accent-primary text-center break-all">
                            0x{result.checksum}
                        </p>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Step-by-Step Calculation">
                    <div className="h-[450px] overflow-y-auto bg-background-elevated p-4 rounded-md">
                        {result ? (
                            <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap">{result.steps.join('\n')}</pre>
                        ) : (
                            <p className="text-text-tertiary">Calculation steps will appear here.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ChecksumSimulator;
