import React, { useState, useEffect, useCallback } from 'react';
import { getScanDiskSimulation } from '../../services/scanDiskService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { StepForwardIcon } from '../../components/Icons';

const SCANSimulator: React.FC = () => {
    const [requestString, setRequestString] = useState<string>('98, 183, 37, 122, 14, 124, 65, 67');
    const [startPos, setStartPos] = useState<number>(53);
    const [direction, setDirection] = useState<'up' | 'down'>('up');
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const maxCylinder = 200;

    const runSimulation = useCallback(() => {
        const requests = requestString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < maxCylinder);
        if (requests.length > 0 && startPos >= 0 && startPos < maxCylinder) {
            const simData = getScanDiskSimulation(requests, startPos, maxCylinder, direction);
            setSimulation(simData);
            setCurrentStep(0);
        }
    }, [requestString, startPos, direction]);

    useEffect(() => { runSimulation(); }, [runSimulation]);

    const handleStep = (dir: number) => {
        if (!simulation) return;
        const nextStep = currentStep + dir;
        if (nextStep >= 0 && nextStep < simulation.steps.length) {
            setCurrentStep(nextStep);
        }
    };
    
    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Disk Head Movement (Elevator Algorithm)">
                    <div className="p-4">
                        <svg width="100%" height="100" viewBox={`0 0 ${maxCylinder} 100`}>
                            <line x1="0" y1="50" x2={maxCylinder} y2="50" stroke="#374151" strokeWidth="2" />
                             {stepData?.state.initialRequests.map((req: any) => (
                                <g key={req.id}>
                                    <circle cx={req.cylinder} cy="50" r="3" fill={stepData.state.serviced.includes(req.cylinder) ? "#10b981" : "#9ca3af"} />
                                    <text x={req.cylinder} y="70" textAnchor="middle" fontSize="8" fill="#d1d5db">{req.cylinder}</text>
                                </g>
                            ))}
                            {stepData && (
                                <g>
                                    <path d={`M ${stepData.state.headPosition} 20 L ${stepData.state.headPosition} 80`} stroke="#3b82f6" strokeWidth="2" />
                                    <circle cx={stepData.state.headPosition} cy="50" r="5" fill="#3b82f6" />
                                </g>
                            )}
                        </svg>
                    </div>
                    <div className="p-4 border-t border-border mt-4">
                        <p className="text-sm text-center font-mono text-text-secondary h-5">{stepData?.description}</p>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="Controls">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Request Queue (0-199)</label>
                            <Input value={requestString} onChange={e => setRequestString(e.target.value)} className="font-mono"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Initial Head Position</label>
                            <Input type="number" min="0" max={maxCylinder-1} value={startPos} onChange={e => setStartPos(parseInt(e.target.value) || 0)} className="font-mono"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Initial Direction</label>
                            <select value={direction} onChange={e => setDirection(e.target.value as 'up' | 'down')} className="w-full bg-background-elevated border border-border rounded-md p-2">
                                <option value="up">Towards higher cylinders</option>
                                <option value="down">Towards lower cylinders</option>
                            </select>
                        </div>
                        <Button onClick={runSimulation} className="w-full">Run Simulation</Button>
                        <div className="flex items-center justify-around pt-2">
                            <Button onClick={() => handleStep(-1)} variant="ghost" size="lg" disabled={currentStep <= 0}><StepForwardIcon className="w-5 h-5 transform rotate-180"/></Button>
                            <Button onClick={() => handleStep(1)} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                                <StepForwardIcon className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card title="Metrics">
                    {stepData && (
                        <div className="font-mono text-sm space-y-3">
                             <div className="flex justify-between">
                                <span className="text-text-tertiary">Direction:</span>
                                <span className="text-text-primary">{stepData.state.direction}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-text-tertiary">Total Head Movement:</span>
                                <span className="text-accent-primary">{stepData.metrics.totalMovement}</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SCANSimulator;
