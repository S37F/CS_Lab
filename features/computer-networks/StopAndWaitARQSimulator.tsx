import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStopAndWaitSimulation, type SimulationEvent } from '../../services/stopAndWaitARQService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

type Scenario = 'normal' | 'data_loss' | 'ack_loss' | 'delayed_ack';

const StopAndWaitARQSimulator: React.FC = () => {
    const [scenario, setScenario] = useState<Scenario>('normal');
    const [simulation, setSimulation] = useState<SimulationEvent[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const runSimulation = useCallback(() => {
        let scenarios = {};
        if (scenario === 'data_loss') scenarios = { 1: { loseData: true } };
        if (scenario === 'ack_loss') scenarios = { 1: { loseAck: true } };
        if (scenario === 'delayed_ack') scenarios = { 1: { delayAck: true } };
        
        const events = generateStopAndWaitSimulation(3, scenarios);
        setSimulation(events);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [scenario]);
    
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
    }, isPlaying ? 800 : null);
    
    const event = simulation[currentStep];

    const Packet: React.FC<{ pkt: NonNullable<SimulationEvent['packet']>, isMoving: boolean }> = ({ pkt, isMoving }) => {
        const isData = pkt.type === 'DATA';
        const yPos = 50 + (currentStep * 20); // Move down over time
        const initialX = isData ? 25 : 75;
        const finalX = isData ? 75 : 25;

        return (
            <AnimatePresence>
                {isMoving && (
                    <motion.g
                        initial={{ x: initialX, y: yPos - 20, opacity: 0 }}
                        animate={{ x: pkt.isLost ? (initialX + finalX) / 2 : finalX, y: yPos, opacity: pkt.isLost ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <rect x="-15" y="-10" width="30" height="20" rx="3" className={isData ? 'fill-blue-500/30' : 'fill-green-500/30'} stroke={isData ? '#3b82f6' : '#10b981'} />
                        <text textAnchor="middle" fontSize="10" className="fill-text-primary font-mono">{isData ? `F${pkt.seq}` : `A${pkt.seq}`}</text>
                    </motion.g>
                )}
            </AnimatePresence>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Card title="Simulation">
                    <div className="relative w-full h-[400px] bg-background-elevated rounded-md overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 100 400" preserveAspectRatio="xMidYMin slice">
                            {/* Lanes */}
                            <text x="25" y="20" textAnchor="middle" className="fill-text-primary font-semibold">Sender</text>
                            <text x="75" y="20" textAnchor="middle" className="fill-text-primary font-semibold">Receiver</text>
                            <line x1="25" y1="30" x2="25" y2="400" className="stroke-border" strokeDasharray="2 2" />
                            <line x1="75" y1="30" x2="75" y2="400" className="stroke-border" strokeDasharray="2 2" />
                            
                            {/* Packets */}
                            {event?.packet && <Packet pkt={event.packet} isMoving={['SEND_DATA', 'SEND_ACK', 'DROP_DATA', 'DROP_ACK'].includes(event.type)} />}
                        </svg>
                    </div>
                </Card>
                <Card title="Event Log">
                    <div className="h-40 overflow-y-auto font-mono text-sm space-y-1">
                        {simulation.slice(0, currentStep + 1).map((e, i) => (
                             <p key={i} className={i === currentStep ? 'text-accent-primary' : 'text-text-tertiary'}>
                                {e.description}
                            </p>
                        ))}
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
                                <option value="delayed_ack">Delayed ACK (Timeout)</option>
                            </select>
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
                            <div className="flex justify-between pl-2">
                                <span className="text-text-tertiary">Next Frame to Send:</span>
                                <span>{event.senderState.nextFrameToSend}</span>
                            </div>
                             <h4 className="font-bold text-text-primary mt-4">Receiver</h4>
                             <div className="flex justify-between pl-2">
                                <span className="text-text-tertiary">Expected Frame:</span>
                                <span>{event.receiverState.expectedFrame}</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default StopAndWaitARQSimulator;
