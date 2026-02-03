
import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { calculateParity, checkParity } from '../../services/parityBitService';

const ParityBitsSimulator: React.FC = () => {
    const [data, setData] = useState<string>('1011010');
    const [parityType, setParityType] = useState<'even' | 'odd'>('even');
    const [transmittedData, setTransmittedData] = useState<string>('');
    const [checkResult, setCheckResult] = useState<{ pass: boolean; message: string } | null>(null);

    useEffect(() => {
        const { parityBit } = calculateParity(data, parityType);
        setTransmittedData(data + parityBit);
        setCheckResult(null); // Reset check result when data changes
    }, [data, parityType]);
    
    useEffect(() => {
        if (transmittedData) {
            const result = checkParity(transmittedData, parityType);
            setCheckResult(result);
        }
    }, [transmittedData, parityType]);

    const handleBitFlip = (index: number) => {
        setTransmittedData(prev => {
            const bits = prev.split('');
            bits[index] = bits[index] === '0' ? '1' : '0';
            return bits.join('');
        });
    };

    const handleDataChange = (value: string) => {
        // Allow only 0s and 1s
        const filteredValue = value.replace(/[^01]/g, '');
        setData(filteredValue);
    };

    const parityBit = transmittedData.slice(-1);
    const originalData = transmittedData.slice(0, -1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card title="1. Sender: Generate Parity">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Data Bits</label>
                            <Input
                                value={data}
                                onChange={(e) => handleDataChange(e.target.value)}
                                placeholder="Enter binary data"
                                className="font-mono text-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Parity Type</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="parity" value="even" checked={parityType === 'even'} onChange={() => setParityType('even')} className="accent-accent-primary" />
                                    <span className="ml-2">Even</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="parity" value="odd" checked={parityType === 'odd'} onChange={() => setParityType('odd')} className="accent-accent-primary" />
                                    <span className="ml-2">Odd</span>
                                </label>
                            </div>
                        </div>
                        <div className="pt-2">
                             <label className="text-sm font-medium text-text-secondary mb-1 block">Transmitted Data (Data + Parity Bit)</label>
                             <div className="font-mono text-lg p-3 bg-background-elevated rounded-md break-all">
                                 <span>{data}</span>
                                 <span className="text-accent-primary font-bold">{calculateParity(data, parityType).parityBit}</span>
                             </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card title="2. Simulate Transmission">
                    <p className="text-sm text-text-secondary mb-2">Click on a bit to flip it and simulate a transmission error.</p>
                     <div className="font-mono text-lg p-3 bg-background-elevated rounded-md flex flex-wrap">
                        {transmittedData.split('').map((bit, index) => (
                            <button key={index} onClick={() => handleBitFlip(index)} 
                                className={`w-6 h-8 flex items-center justify-center rounded-sm hover:bg-border transition-colors ${index === transmittedData.length - 1 ? 'text-accent-primary font-bold' : ''}`}>
                                {bit}
                            </button>
                        ))}
                     </div>
                </Card>
                <Card title="3. Receiver: Check Parity">
                    {checkResult && (
                        <div className={`p-4 rounded-md text-center ${checkResult.pass ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-warning/20 text-accent-warning'}`}>
                            <h3 className="font-bold text-lg">{checkResult.pass ? "Check Passed" : "Error Detected!"}</h3>
                            <p className="text-sm">{checkResult.message}</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ParityBitsSimulator;
