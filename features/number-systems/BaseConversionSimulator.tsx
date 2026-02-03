
import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const BaseConversionSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('13');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);

  const generateSteps = (value: string, from: number, to: number) => {
      const newSteps: string[] = [];
      const decimalValue = parseInt(value, from);
      if (isNaN(decimalValue)) return;

      newSteps.push(`1. Convert input "${value}" from base-${from} to decimal (base-10).`);
      newSteps.push(`   Result: ${decimalValue}₁₀`);
      
      if (to === 10) {
          setSteps(newSteps);
          return;
      }
      
      newSteps.push(`\n2. Convert decimal value ${decimalValue}₁₀ to base-${to}.`);
      if (decimalValue === 0) {
          newSteps.push('   Result is 0.');
          setSteps(newSteps);
          return;
      }

      let tempDecimal = decimalValue;
      let conversionSteps: string[] = [];
      while(tempDecimal > 0) {
          const remainder = tempDecimal % to;
          const quotient = Math.floor(tempDecimal / to);
          conversionSteps.unshift(`   ${tempDecimal} / ${to} = ${quotient} remainder ${remainder.toString(36).toUpperCase()}`);
          tempDecimal = quotient;
      }
      newSteps.push(...conversionSteps);
      newSteps.push(`\n3. Read remainders from bottom to top to get the final result.`);
      setSteps(newSteps);
  }

  const handleConvert = () => {
    setError('');
    setSteps([]);
    if (!inputValue.trim()) {
      setError("Input value cannot be empty.");
      return;
    }
    
    // Validate input characters for the given base
    const validChars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, fromBase);
    const regex = new RegExp(`^[${validChars}]+$`, 'i');
    if (!regex.test(inputValue)) {
      setError(`Invalid character in input for base-${fromBase}.`);
      return;
    }

    try {
      const decimalValue = parseInt(inputValue, fromBase);
      if (isNaN(decimalValue)) {
          setError("Invalid number for the specified base.");
          return;
      }
      const convertedValue = decimalValue.toString(toBase).toUpperCase();
      setResult(convertedValue);
      generateSteps(inputValue, fromBase, toBase);
    } catch (e) {
      setError("An error occurred during conversion.");
    }
  };
  
  const BaseSelector: React.FC<{label: string, value: number, onChange: (val: number) => void}> = ({label, value, onChange}) => (
      <div>
        <label className="text-sm font-medium text-text-secondary mb-1 block">{label}</label>
        <Input type="number" min="2" max="36" value={value} onChange={e => onChange(Math.max(2, Math.min(36, parseInt(e.target.value) || 2)))} />
      </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Card title="Conversion Controls">
          <div className="space-y-4">
             <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Number to Convert</label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="font-mono text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <BaseSelector label="From Base" value={fromBase} onChange={setFromBase} />
              <BaseSelector label="To Base" value={toBase} onChange={setToBase} />
            </div>
            <Button onClick={handleConvert} className="w-full">Convert</Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        </Card>
         <Card title="Result" className="mt-6">
            <p className="font-mono text-2xl text-accent-primary text-center break-all">{result || '...'}</p>
        </Card>
      </div>
      <div>
        <Card title="Step-by-Step Explanation">
            <div className="h-80 overflow-y-auto bg-background-elevated p-4 rounded-md">
                {steps.length > 0 ? (
                    <pre className="font-mono text-sm text-text-secondary whitespace-pre-wrap">{steps.join('\n')}</pre>
                ) : (
                    <p className="text-text-tertiary">Calculation steps will appear here after conversion.</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default BaseConversionSimulator;
