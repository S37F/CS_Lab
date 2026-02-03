
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getIeee754Steps } from '../../services/ieee754Service';

const IEEE754Simulator: React.FC = () => {
    const [decimalInput, setDecimalInput] = useState<string>('9.125');
    const [precision, setPrecision] = useState<'single' | 'double'>('single');
    const [result, setResult] = useState<{ sign: string; exponent: string; mantissa: string; } | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    const handleCalculate = () => {
        const num = parseFloat(decimalInput);
        if (isNaN(num)) {
            setError("Please enter a valid decimal number.");
            setSteps([]);
            setResult(null);
            return;
        }

        const { steps: newSteps, result: newResult, error: newError } = getIeee754Steps(num, precision);
        setError(newError);
        setSteps(newSteps);
        setResult(newResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Input">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Decimal Number</label>
                            <Input
                                value={decimalInput}
                                onChange={(e) => setDecimalInput(e.target.value)}
                                placeholder="e.g., -12.75"
                                className="font-mono text-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Precision</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="precision" value="single" checked={precision === 'single'} onChange={() => setPrecision('single')} className="accent-accent-primary" />
                                    <span className="ml-2">Single (32-bit)</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="precision" value="double" checked={precision === 'double'} onChange={() => setPrecision('double')} className="accent-accent-primary" />
                                    <span className="ml-2">Double (64-bit)</span>
                                </label>
                            </div>
                        </div>
                        <Button onClick={handleCalculate} className="w-full">Convert</Button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </div>
                </Card>
                {result && (
                    <Card title="Result" className="mt-6">
                        <div className="font-mono text-sm space-y-2 break-all">
                            <div className="flex">
                                <span className="bg-red-500/30 p-1 rounded-l-md">{result.sign}</span>
                                <span className="bg-blue-500/30 p-1">{result.exponent}</span>
                                <span className="bg-green-500/30 p-1 rounded-r-md">{result.mantissa}</span>
                            </div>
                            <div className="flex text-xs mt-1">
                                <div className="text-red-400 w-1/12">Sign</div>
                                <div className="text-blue-400 w-4/12">Exponent</div>
                                <div className="text-green-400 w-7/12">Mantissa</div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Step-by-Step Calculation">
                    <div className="h-[450px] overflow-y-auto bg-background-elevated p-4 rounded-md">
                        {steps.length > 0 ? (
                            <div className="font-mono text-sm text-text-secondary space-y-3">
                                {steps.map((step, index) => (
                                    <div key={index} dangerouslySetInnerHTML={{ __html: step }}></div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-tertiary">Calculation steps will appear here.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default IEEE754Simulator;
