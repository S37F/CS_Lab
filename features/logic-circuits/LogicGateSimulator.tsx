
import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';

const LogicGateSimulator: React.FC = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [carryIn, setCarryIn] = useState(false);

  const { sum, carryOut } = useMemo(() => {
    // Full Adder Logic
    // Sum = A XOR B XOR CarryIn
    const sum = inputA !== inputB !== carryIn;
    // CarryOut = (A AND B) OR (CarryIn AND (A XOR B))
    const carryOut = (inputA && inputB) || (carryIn && (inputA !== inputB));
    return { sum, carryOut };
  }, [inputA, inputB, carryIn]);
  
  const Toggle: React.FC<{ label: string, value: boolean, onToggle: () => void }> = ({ label, value, onToggle }) => (
    <div className="flex flex-col items-center">
        <label className="text-sm font-mono mb-2">{label}</label>
        <button onClick={onToggle} className={`w-12 h-12 rounded-full font-bold text-lg transition-colors ${value ? 'bg-accent-success text-white' : 'bg-background-elevated text-text-tertiary'}`}>
            {value ? '1' : '0'}
        </button>
    </div>
  );

  return (
    <Card title="Full Adder Circuit">
        <div className="p-4 flex flex-col items-center">
            <p className="text-text-secondary mb-8 text-center">This is a fixed-circuit demonstration of a 1-bit Full Adder. Toggle the inputs to see the output change.</p>
            <div className="flex space-x-8">
                <Toggle label="Input A" value={inputA} onToggle={() => setInputA(v => !v)} />
                <Toggle label="Input B" value={inputB} onToggle={() => setInputB(v => !v)} />
                <Toggle label="Carry In (Cin)" value={carryIn} onToggle={() => setCarryIn(v => !v)} />
            </div>
            
            <div className="my-8 text-2xl font-mono text-text-tertiary">&darr;</div>

             <div className="p-4 bg-background-elevated rounded-lg border border-border">
                <svg width="200" height="100" viewBox="0 0 200 100">
                    <rect x="50" y="20" width="100" height="60" stroke="#9ca3af" fill="#111111" />
                    <text x="100" y="55" textAnchor="middle" fill="#d1d5db" fontSize="12">FULL ADDER</text>
                    <text x="75" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10">A</text>
                    <text x="100" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10">B</text>
                    <text x="125" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10">Cin</text>
                    <text x="75" y="95" textAnchor="middle" fill="#9ca3af" fontSize="10">Sum</text>
                    <text x="125" y="95" textAnchor="middle" fill="#9ca3af" fontSize="10">Cout</text>
                </svg>
            </div>
            
             <div className="my-8 text-2xl font-mono text-text-tertiary">&darr;</div>

            <div className="flex space-x-8">
                <div className="flex flex-col items-center">
                    <label className="text-sm font-mono mb-2">Sum (S)</label>
                    <div className={`w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center ${sum ? 'bg-accent-primary text-white' : 'bg-background-elevated text-text-tertiary'}`}>
                         {sum ? '1' : '0'}
                    </div>
                </div>
                 <div className="flex flex-col items-center">
                    <label className="text-sm font-mono mb-2">Carry Out (Cout)</label>
                    <div className={`w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center ${carryOut ? 'bg-accent-primary text-white' : 'bg-background-elevated text-text-tertiary'}`}>
                         {carryOut ? '1' : '0'}
                    </div>
                </div>
            </div>
        </div>
    </Card>
  );
};

export default LogicGateSimulator;
