import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getSignedMagnitude } from '../../services/signedMagnitudeService';

const SignedMagnitudeSimulator: React.FC = () => {
  const [decimalInput, setDecimalInput] = useState<string>('-42');
  const [bits, setBits] = useState<number>(8);
  const [result, setResult] = useState<{ binary: string; sign: string; magnitude: string; range: string; } | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    const num = parseInt(decimalInput, 10);
    if (isNaN(num)) {
      setError("Please enter a valid decimal number.");
      setResult(null);
      return;
    }

    const { result: newResult, error: newError } = getSignedMagnitude(num, bits);
    setError(newError);
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
      </div>
      <div>
        <Card title="Result">
          {result ? (
            <div className="font-mono text-sm space-y-4">
              <div className="text-center text-2xl break-all">
                <span className="bg-red-500/30 p-1 rounded-l-md">{result.sign}</span>
                <span className="bg-blue-500/30 p-1 rounded-r-md">{result.magnitude}</span>
              </div>
              <div className="flex text-xs mt-1">
                  <div className="text-red-400 w-1/4">Sign Bit</div>
                  <div className="text-blue-400 w-3/4">Magnitude</div>
              </div>
              <p className="text-text-secondary pt-4">The representable range for {bits} bits is <strong>{result.range}</strong>.</p>
              {parseInt(decimalInput, 10) === 0 && <p className="text-text-tertiary text-xs mt-2">Note: Signed Magnitude has two representations for zero (+0 and -0).</p>}
            </div>
          ) : (
            <p className="text-text-tertiary p-4">Result will appear here.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SignedMagnitudeSimulator;