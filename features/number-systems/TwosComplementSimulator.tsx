
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getTwosComplementSteps } from '../../services/twosComplementService';

const TwosComplementSimulator: React.FC = () => {
  const [decimalInput, setDecimalInput] = useState<string>('-5');
  const [bits, setBits] = useState<number>(8);
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    const num = parseInt(decimalInput, 10);
    if (isNaN(num)) {
      setError("Please enter a valid decimal number.");
      setSteps([]);
      setResult('');
      return;
    }

    const { steps: newSteps, result: newResult, error: newError } = getTwosComplementSteps(num, bits);
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
                type="number"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
                placeholder="e.g., -42"
                className="font-mono text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Number of Bits</label>
              <Input
                type="number"
                min="2"
                max="64"
                step="1"
                value={bits}
                onChange={(e) => setBits(parseInt(e.target.value) || 8)}
                className="font-mono"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </div>
        </Card>
        <Card title="Result" className="mt-6">
          <p className="font-mono text-2xl text-accent-primary text-center break-all">{result || '...'}</p>
        </Card>
      </div>
      <div>
        <Card title="Step-by-Step Calculation">
          <div className="h-80 overflow-y-auto bg-background-elevated p-4 rounded-md">
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

export default TwosComplementSimulator;
