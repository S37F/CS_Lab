import React, { useState, useCallback, useEffect } from 'react';
import { getLzwSimulation } from '../../services/lzwService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LZWSimulator: React.FC = () => {
    const [text, setText] = useState<string>('TOBEORNOTTOBEORTOBEORNOT');
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    
    const runSimulation = useCallback(() => {
        if (text.length > 0) {
            const simData = getLzwSimulation(text);
            setSimulation(simData);
            setCurrentStep(0);
        }
    }, [text]);

    useEffect(() => { runSimulation() }, [runSimulation]);

    const handleStep = (direction: number) => {
        if (!simulation) return;
        setCurrentStep(prev => Math.max(0, Math.min(simulation.steps.length - 1, prev + direction)));
    };
    
    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                 <Card title="Controls">
                     <div className="space-y-4">
                        <Input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-2 font-mono"
                            placeholder="Enter text to compress..."
                        />
                        <Button onClick={runSimulation} className="w-full">Compress</Button>
                        <div className="flex justify-between items-center">
                            <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>Prev</Button>
                            <span className="font-mono text-sm">{currentStep} / {simulation ? simulation.steps.length - 1 : 0}</span>
                            <Button onClick={() => handleStep(1)} disabled={!simulation || currentStep >= simulation.steps.length - 1}>Next</Button>
                        </div>
                    </div>
                </Card>
                 <Card title="Simulation Trace">
                    <div className="font-mono text-sm space-y-3">
                         <div className="flex justify-between"><span className="text-text-tertiary">Current String (w):</span> <strong>{stepData?.state.w}</strong></div>
                         <div className="flex justify-between"><span className="text-text-tertiary">Next Char (K):</span> <strong>{stepData?.state.k}</strong></div>
                         <div className="flex justify-between"><span className="text-text-tertiary">w + K in Dictionary?:</span> <strong>{stepData?.state.found ? 'Yes' : 'No'}</strong></div>
                         <div className="flex justify-between"><span className="text-text-tertiary">Output Code:</span> <strong className="text-accent-primary">{stepData?.state.output}</strong></div>
                         <div className="flex justify-between"><span className="text-text-tertiary">New Dictionary Entry:</span> <strong className="text-accent-success">{stepData?.state.newEntry}</strong></div>
                    </div>
                 </Card>
                 <Card title="Output Code Sequence">
                    <div className="font-mono text-sm p-2 bg-background-elevated rounded-md h-24 overflow-y-auto">
                        {simulation?.result.output.join(' ')}
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="Dictionary">
                    <div className="font-mono text-sm space-y-1 h-[450px] overflow-y-auto">
                        {stepData && Object.entries(stepData.state.dictionary).map(([key, value]) => (
                            <div key={key} className={`flex justify-between p-1 rounded-md ${stepData.state.newEntry?.includes(key) ? 'bg-accent-success/20' : ''}`}>
                                <span>{value as number}</span>
                                <span>{key}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LZWSimulator;