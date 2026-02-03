
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { calculateCrc } from '../../services/crcService';

const CRCSimulator: React.FC = () => {
    const [dataBits, setDataBits] = useState<string>('110101');
    const [generator, setGenerator] = useState<string>('1011');
    const [result, setResult] = useState<{ remainder: string; transmitted: string; steps: string[] } | null>(null);
    const [error, setError] = useState<string>('');

    const handleCalculate = () => {
        if (!/^[01]+$/.test(dataBits) || !/^[01]+$/.test(generator) || !generator.startsWith('1')) {
            setError("Inputs must be binary strings (0s and 1s). Generator must start with 1.");
            setResult(null);
            return;
        }
        setError('');
        const crcResult = calculateCrc(dataBits, generator);
        setResult(crcResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Input">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Data Bits (Message)</label>
                            <Input
                                value={dataBits}
                                onChange={(e) => setDataBits(e.target.value.replace(/[^01]/g, ''))}
                                placeholder="e.g. 110101"
                                className="font-mono text-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Generator Polynomial (Divisor)</label>
                            <Input
                                value={generator}
                                onChange={(e) => setGenerator(e.target.value.replace(/[^01]/g, ''))}
                                placeholder="e.g. 1011"
                                className="font-mono text-lg"
                            />
                        </div>
                        <Button onClick={handleCalculate} className="w-full">Calculate CRC</Button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </div>
                </Card>
                {result && (
                    <Card title="Result" className="mt-6">
                        <div className="font-mono text-sm space-y-3">
                            <div className="flex justify-between">
                                <span>CRC Remainder:</span>
                                <span className="text-accent-primary font-bold">{result.remainder}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transmitted Data:</span>
                                <span className="font-bold">{result.transmitted}</span>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Calculation Steps (Binary Division using XOR)">
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

export default CRCSimulator;
