import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSelectiveRepeatSimulation, type SR_SimulationEvent } from '../../services/selectiveRepeatARQService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';
import Slider from '../../components/ui/Slider';

type Scenario = 'normal' | 'data_loss' | 'ack_loss';

const SelectiveRepeatARQSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [windowSize, setWindowSize] = useState(4);
  const [simulation, setSimulation] = useState<SR_SimulationEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = useCallback(() => {
    let scenarios = {};
    if (scenario === 'data_loss') scenarios = { loseData: [3, 7] };
    if (scenario === 'ack_loss') scenarios = { loseAck: [2, 5] };

    const events = generateSelectiveRepeatSimulation(10, windowSize, scenarios);
    setSimulation(events);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [scenario, windowSize]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

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

  const WindowBox: React.FC<{ title: string; base: number; size: number; highlight: number[]; acked?: number[] }> = ({
    title,
    base,
    size,
    highlight,
    acked = [],
  }) => (
    <div className="w-full">
      <p className="font-semibold text-center mb-2">{title}</p>
      <div className="flex justify-center space-x-1 flex-wrap">
        {Array.from({ length: 10 }).map((_, i) => {
          const isInWindow = i >= base && i < base + size;
          const isHighlighted = highlight.includes(i);
          const isAcked = acked.includes(i);
          return (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded border m-0.5
                ${isAcked ? 'bg-green-500 text-white border-green-500' : ''}
                ${isHighlighted && !isAcked ? 'bg-accent-primary text-white border-accent-primary' : ''}
                ${isInWindow && !isHighlighted && !isAcked ? 'border-accent-primary border-2' : ''}
                ${!isInWindow && !isHighlighted && !isAcked ? 'border-border' : ''}
              `}
            >
              <span className="text-xs font-mono">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Selective Repeat ARQ Simulation">
          <div className="p-4 space-y-6">
            {/* Sender Window */}
            <WindowBox
              title="Sender Window"
              base={event?.senderState.windowBase || 0}
              size={windowSize}
              highlight={event?.senderState.sentPackets || []}
              acked={event?.senderState.ackedPackets || []}
            />

            {/* Packet Transmission Visualization */}
            <div className="relative bg-background-elevated rounded-lg p-6 min-h-[120px]">
              <div className="absolute top-4 left-4 font-semibold">Sender</div>
              <div className="absolute top-4 right-4 font-semibold">Receiver</div>

              {/* Packet in transit */}
              <AnimatePresence>
                {event?.packet && (
                  <motion.div
                    initial={{ x: 0, opacity: 1 }}
                    animate={{
                      x: event.packet.type === 'DATA' ? '70%' : '-70%',
                      opacity: event.packet.isLost ? 0 : 1,
                    }}
                    exit={{ opacity: 0 }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold ${
                      event.packet.type === 'DATA'
                        ? 'bg-blue-500 text-white'
                        : event.packet.type === 'ACK'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {event.packet.type} {event.packet.seq}
                    {event.packet.isLost && ' ❌'}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-16"></div>
            </div>

            {/* Receiver Window & Buffer */}
            <div className="space-y-3">
              <WindowBox
                title="Receiver Window"
                base={event?.receiverState.windowBase || 0}
                size={windowSize}
                highlight={event?.receiverState.receivedPackets || []}
              />
              
              {event?.receiverState.bufferedPackets && event.receiverState.bufferedPackets.length > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
                  <p className="text-sm font-semibold text-yellow-600">
                    Buffered (out-of-order): {event.receiverState.bufferedPackets.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="bg-background-elevated rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono text-text-secondary">Time: {event?.time || 0}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event?.type === 'SEND'
                      ? 'bg-blue-500/20 text-blue-500'
                      : event?.type === 'ACK'
                      ? 'bg-green-500/20 text-green-500'
                      : event?.type === 'TIMEOUT'
                      ? 'bg-orange-500/20 text-orange-500'
                      : event?.type === 'DROP_DATA' || event?.type === 'DROP_ACK'
                      ? 'bg-red-500/20 text-red-500'
                      : event?.type === 'DELIVER'
                      ? 'bg-purple-500/20 text-purple-500'
                      : event?.type === 'BUFFER'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-border text-text-secondary'
                  }`}
                >
                  {event?.type || 'INFO'}
                </span>
              </div>
              <div className="mt-2 font-medium">{event?.description}</div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {simulation.length}
              </span>
              <div className="flex space-x-2">
                <Button onClick={() => handleStep(-1)} disabled={currentStep === 0}>
                  <StepForwardIcon className="w-4 h-4 rotate-180" />
                </Button>
                <Button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                </Button>
                <Button onClick={() => handleStep(1)} disabled={currentStep === simulation.length - 1}>
                  <StepForwardIcon className="w-4 h-4" />
                </Button>
                <Button onClick={runSimulation}>
                  <RefreshIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={simulation.length - 1}
              value={currentStep}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStep(parseInt(e.target.value));
              }}
              className="w-full"
            />
          </div>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="space-y-6">
        <Card title="Configuration">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as Scenario)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="normal">Normal Transmission</option>
                <option value="data_loss">Data Frame Loss</option>
                <option value="ack_loss">ACK Loss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Window Size: {windowSize}
              </label>
              <Slider
                min={2}
                max={6}
                step={1}
                value={windowSize}
                onChange={(val) => setWindowSize(val)}
              />
            </div>
            <Button onClick={runSimulation} className="w-full">
              Run Simulation
            </Button>
          </div>
        </Card>

        <Card title="Window State">
          <div className="p-4 space-y-3 text-sm">
            <div>
              <span className="text-text-secondary">Sender Window Base:</span>
              <span className="ml-2 font-semibold">{event?.senderState.windowBase || 0}</span>
            </div>
            <div>
              <span className="text-text-secondary">Receiver Window Base:</span>
              <span className="ml-2 font-semibold">{event?.receiverState.windowBase || 0}</span>
            </div>
            <div>
              <span className="text-text-secondary">Sent Packets:</span>
              <span className="ml-2 font-mono text-xs">
                [{event?.senderState.sentPackets.join(', ') || ''}]
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Acked Packets:</span>
              <span className="ml-2 font-mono text-xs text-green-500">
                [{event?.senderState.ackedPackets.join(', ') || ''}]
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Received Packets:</span>
              <span className="ml-2 font-mono text-xs">
                [{event?.receiverState.receivedPackets.join(', ') || ''}]
              </span>
            </div>
          </div>
        </Card>

        <Card title="About Selective Repeat">
          <div className="p-4 text-sm text-text-secondary space-y-2">
            <p>
              Selective Repeat ARQ retransmits only the packets that are lost or damaged,
              unlike Go-Back-N which retransmits all packets from the lost one.
            </p>
            <p>
              The receiver buffers out-of-order packets and delivers them in sequence once
              gaps are filled.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SelectiveRepeatARQSimulator;
