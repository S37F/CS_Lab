
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { generateHammingCode, checkHammingCode } from '../../services/hammingCodeService';

const HammingCodeSimulator: React.FC = () => {
    const [dataword, setDataword] = useState('1011');
    const [generated, setGenerated] = useState<{ codeword: string, parityBits: number[], m: number, r: number } | null>(null);
    const [receivedCodeword, setReceivedCodeword] = useState('');
    const [checkResult, setCheckResult] = useState<{ syndrome: string, errorPosition: number, corrected: string } | null>(null);

    useEffect(() => {
        if (dataword.length > 0) {
            const result = generateHammingCode(dataword);
            setGenerated(result);
            setReceivedCodeword(result.codeword);
        } else {
            setGenerated(null);
            setReceivedCodeword('');
        }
    }, [dataword]);

    useEffect(() => {
        if (receivedCodeword.length > 0 && generated) {
            const result = checkHammingCode(receivedCodeword, generated.r);
            setCheckResult(result);
        } else {
            setCheckResult(null);
        }
    }, [receivedCodeword, generated]);

    const handleBitFlip = (index: number) => {
        setReceivedCodeword(prev => {
            const bits = prev.split('');
            bits[index] = bits[index] === '0' ? '1' : '0';
            return bits.join('');
        });
    };
    
    const isParityBit = (index: number) => {
        const pos = index + 1;
        return (pos & (pos - 1)) === 0;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card title="1. Sender: Generate Hamming Code">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Dataword (Binary)</label>
                            <Input
                                value={dataword}
                                onChange={(e) => setDataword(e.target.value.replace(/[^01]/g, ''))}
                                placeholder="Enter binary data"
                                className="font-mono text-lg"
                            />
                        </div>
                         {generated && (
                            <div>
                                <label className="text-sm font-medium text-text-secondary mb-1 block">Generated Codeword:</label>
                                <div className="font-mono text-lg p-2 bg-background-elevated rounded-md flex flex-wrap">
                                    {generated.codeword.split('').map((bit, index) => (
                                        <span key={index} className={`w-6 h-8 flex items-center justify-center ${isParityBit(index) ? 'text-accent-primary font-bold' : ''}`}>
                                            {bit}
                                        </span>
                                    ))}
                                </div>
                                 <p className="text-xs text-text-tertiary mt-1">Parity bits (p) are highlighted.</p>
                            </div>
                        )}
                    </div>
                </Card>
                <Card title="2. Simulate Transmission Error">
                    <p className="text-sm text-text-secondary mb-2">Click on a bit below to flip it and simulate an error.</p>
                     <div className="font-mono text-lg p-2 bg-background-elevated rounded-md flex flex-wrap">
                        {receivedCodeword.split('').map((bit, index) => (
                            <button key={index} onClick={() => handleBitFlip(index)} 
                                className={`w-6 h-8 flex items-center justify-center rounded-sm hover:bg-border transition-colors 
                                ${isParityBit(index) ? 'text-accent-primary font-bold' : ''}
                                ${generated && bit !== generated.codeword[index] ? 'bg-red-500/50' : ''}
                                `}>
                                {bit}
                            </button>
                        ))}
                     </div>
                </Card>
            </div>
             <div className="space-y-6">
                 <Card title="3. Receiver: Error Detection & Correction">
                    {checkResult && (
                        <div className="font-mono text-sm space-y-4">
                            <div>
                                 <label className="font-medium text-text-secondary block">Syndrome Calculation:</label>
                                 <p className="text-accent-warning font-bold text-lg">{checkResult.syndrome}</p>
                            </div>
                            <div>
                                <label className="font-medium text-text-secondary block">Error Position:</label>
                                {checkResult.errorPosition === 0 ? (
                                    <p className="text-accent-success font-bold text-lg">0 (No error detected)</p>
                                ) : (
                                    <p className="text-red-500 font-bold text-lg">{checkResult.errorPosition} (Error detected at bit {checkResult.errorPosition})</p>
                                )}
                            </div>
                             <div>
                                <label className="font-medium text-text-secondary block">Corrected Codeword:</label>
                                <p className="font-bold text-lg break-all">{checkResult.corrected}</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default HammingCodeSimulator;
