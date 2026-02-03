import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGoBackNSimulation, type GBN_SimulationEvent } from '../../services/goBackNARQService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';
import Slider from '../../components/ui/Slider';

type Scenario = 'normal' | 'data_loss' | 'ack_loss';

const GoBackNARQSimulator: React.FC = () => {
    const [scenario, setScenario] = useState<Scenario>('normal');
    const [windowSize, setWindowSize] = useState(4);
    const [simulation, setSimulation] = useState<GBN_SimulationEvent[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const runSimulation = useCallback(() => {
        let scenarios = {};
        if (scenario === 'data_loss') scenarios = { loseData: [5] };
        if (scenario === 'ack_loss') scenarios = { loseAck: [3] };
        
        const events = generateGoBackNSimulation(10, windowSize, scenarios);
        setSimulation(events);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [scenario, windowSize]);
    
    useEffect(() => { runSimulation(); }, [runSimulation]);

    const handleStep = (dir: number) => {
        setIsPlaying(false);
        setCurrentStep(prev => Math.max(0, Math.min(simulation.length - 1, prev + dir)));
    };
    
    useInterval(() => {
        if (isPlaying && currentStep < simulation.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    }, isPlaying ? 500 : null);
    
    const event = simulation[currentStep];

    const WindowBox: React.FC<{ title: string, base: number, size: number, highlight: number[] }> = ({ title, base, size, highlight }) => (
        <div className="w-full">
            <p className="font-semibold text-center mb-2">{title}</p>
            <div className="flex justify-center space-x-1">
                {Array.from({ length: 10 }).map((_, i) => {
                    const isInWindow = i >= base && i < base + size;
                    const isHighlighted = highlight.includes(i);
                    return (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border
                            ${isHighlighted ? 'bg-accent-primary text-white' : ''}
                            ${isInWindow ? 'border-accent-primary' : 'border-border'}
                        `}>
                            {i}
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Card title="Simulation">
                     <div className="p-4 space-y-4">
                        <WindowBox title="Sender Window" base={event?.senderState.base} size={windowSize} highlight={event?.senderState.window || []} />
                        
                        <div className="relative w-full h-[150px] bg-background-elevated rounded-md overflow-hidden">
                             {/* Packet animation will be complex, showing a simplified state instead */}
                             <div className="p-4 text-center font-mono text-text-secondary">{event?.description}</div>
                        </div>

                         <div className="w-full">
                             <p className="font-semibold text-center mb-2">Receiver</p>
                            <div className="flex justify-center items-center space-x-2">
                                <p>Expecting SeqNum:</p>
                                <div className="w-10 h-10 flex items-center justify-center rounded border border-accent-success font-bold text-lg">
                                    {event?.receiverState.expectedSeqNum}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card title="Controls">
                     <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Scenario</label>
                            <select value={scenario} onChange={e => setScenario(e.target.value as Scenario)} className="w-full bg-background-elevated border border-border rounded-md p-2">
                                <option value="normal">Normal Operation</option>
                                <option value="data_loss">Lose a Data Frame</option>
                                <option value="ack_loss">Lose an ACK Frame</option>
                            </select>
                        </div>
                        <div>
                           <Slider label={`Window Size: ${windowSize}`} min="2" max="8" value={windowSize} onChange={e => setWindowSize(Number(e.target.value))} />
                        </div>
                        <div className="flex items-center justify-around pt-2">
                             <Button onClick={runSimulation} variant="ghost" size="lg"><RefreshIcon className="w-5 h-5"/></Button>
                            <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                            </Button>
                            <Button onClick={() => handleStep(1)} variant="ghost" size="lg" disabled={currentStep >= simulation.length - 1}>
                                <StepForwardIcon className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </Card>
                 <Card title="State">
                    {event && (
                        <div className="font-mono text-sm space-y-3">
                            <h4 className="font-bold text-text-primary">Sender</h4>
                            <div className="flex justify-between pl-2"><span>Base:</span> <span>{event.senderState.base}</span></div>
                            <div className="flex justify-between pl-2"><span>Next SeqNum:</span> <span>{event.senderState.nextSeqNum}</span></div>
                             <h4 className="font-bold text-text-primary mt-4">Receiver</h4>
                             <div className="flex justify-between pl-2"><span>Expecting:</span> <span>{event.receiverState.expectedSeqNum}</span></div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GoBackNARQSimulator;
