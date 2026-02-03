
import React, { useState, useEffect, useCallback } from 'react';
import { getFifoSimulation } from '../../services/fifoPageReplacementService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const FIFOPageReplacementSimulator: React.FC = () => {
    const [pageString, setPageString] = useState<string>('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2');
    const [frameCount, setFrameCount] = useState<number>(3);
    const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const runSimulation = useCallback(() => {
        const pages = pageString.split(',').map(s => s.trim()).filter(Boolean);
        if (pages.length > 0 && frameCount > 0) {
            const simData = getFifoSimulation(pages, frameCount);
            setSimulation(simData);
            setCurrentStep(0);
            setIsPlaying(false);
        }
    }, [pageString, frameCount]);

    useEffect(() => {
        runSimulation();
    }, [runSimulation]);
    
    const handleReset = () => runSimulation();
    const handleStepForward = () => {
        if (simulation && currentStep < simulation.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setIsPlaying(false);
        }
    };

    useInterval(() => {
        if (isPlaying && simulation && currentStep < simulation.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else if (isPlaying) {
            setIsPlaying(false);
        }
    }, isPlaying ? 800 : null);
    
    const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Memory Frames">
                    <div className="flex justify-center items-center space-x-2 p-4 min-h-[120px]">
                        {stepData?.state.frames.map((page: string | null, index: number) => (
                             <div key={index} className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-md border-2
                                ${stepData?.state.lastEvent?.page === page ? 
                                    (stepData.state.lastEvent.type === 'hit' ? 'border-accent-success bg-green-900' : 'border-red-500 bg-red-900') 
                                    : 'border-border bg-background-elevated'}`}>
                                {page ?? '-'}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-border mt-4">
                        <p className="text-sm text-center font-mono text-text-secondary h-5">{stepData?.description}</p>
                    </div>
                </Card>
                 <Card title="Page Reference String">
                    <div className="flex justify-center items-center space-x-1 p-2 flex-wrap">
                        {stepData?.state.pages.map((page: string, index: number) => (
                            <div key={index} className={`px-3 py-1 rounded-md font-mono ${index === stepData.state.pageIndex ? 'bg-accent-primary text-white' : 'bg-background-elevated'}`}>
                                {page}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="Controls">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Page Reference String</label>
                            <Input value={pageString} onChange={e => setPageString(e.target.value)} className="font-mono"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Number of Frames</label>
                            <Input type="number" min="1" max="10" value={frameCount} onChange={e => setFrameCount(parseInt(e.target.value) || 1)} className="font-mono"/>
                        </div>
                        <Button onClick={runSimulation} className="w-full">Run Simulation</Button>
                         <div className="flex items-center justify-around pt-2">
                            <Button onClick={handleReset} variant="ghost" size="lg"><RefreshIcon className="w-5 h-5"/></Button>
                            <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                            </Button>
                            <Button onClick={handleStepForward} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                                <StepForwardIcon className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card title="Metrics">
                    {stepData && (
                        <div className="font-mono text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Page Faults:</span>
                                <span className="text-text-primary">{stepData.metrics.faults}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Page Hits:</span>
                                <span className="text-text-primary">{stepData.metrics.hits}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Total Pages:</span>
                                <span className="text-text-primary">{stepData.state.pages.length}</span>
                            </div>
                             <div className="flex justify-between font-bold">
                                <span className="text-text-tertiary">Fault Rate:</span>
                                <span className="text-text-primary">
                                    {((stepData.metrics.faults / (stepData.metrics.hits + stepData.metrics.faults)) * 100 || 0).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default FIFOPageReplacementSimulator;
