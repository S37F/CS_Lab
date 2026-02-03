import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateLeakyBucketSimulation,
  generateRandomArrivals,
  type LeakyBucket_SimulationEvent,
} from '../../services/leakyBucketService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';
import Slider from '../../components/ui/Slider';

const LeakyBucketSimulator: React.FC = () => {
  const [bucketCapacity, setBucketCapacity] = useState(10);
  const [leakRate, setLeakRate] = useState(2);
  const [simulation, setSimulation] = useState<LeakyBucket_SimulationEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = useCallback(() => {
    const arrivals = generateRandomArrivals(15, 20);
    const events = generateLeakyBucketSimulation(bucketCapacity, leakRate, arrivals);
    setSimulation(events);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [bucketCapacity, leakRate]);

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

  const bucketFillPercentage = event
    ? (event.bucketState.currentSize / event.bucketState.capacity) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Leaky Bucket Simulation">
          <div className="p-6 space-y-6">
            {/* Bucket Visualization */}
            <div className="flex justify-center items-end h-[400px]">
              <div className="relative w-64">
                {/* Bucket container */}
                <div className="relative w-full h-80 border-4 border-border rounded-b-lg bg-background-elevated overflow-hidden">
                  {/* Water/packets in bucket */}
                  <motion.div
                    className="absolute bottom-0 w-full bg-accent-primary/60"
                    animate={{ height: `${bucketFillPercentage}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />

                  {/* Capacity marker lines */}
                  {[25, 50, 75, 100].map((percent) => (
                    <div
                      key={percent}
                      className="absolute w-full border-t border-border/30"
                      style={{ bottom: `${percent}%` }}
                    >
                      <span className="absolute right-2 text-xs text-text-secondary">
                        {Math.round((percent / 100) * event?.bucketState.capacity)}
                      </span>
                    </div>
                  ))}

                  {/* Current size label */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-3xl font-bold">
                      {event?.bucketState.currentSize || 0}
                    </div>
                    <div className="text-sm text-text-secondary">
                      / {event?.bucketState.capacity || bucketCapacity}
                    </div>
                  </div>
                </div>

                {/* Leak visualization */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8">
                  {event?.type === 'LEAK' && (
                    <motion.div
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: 20, opacity: 0 }}
                      className="text-accent-primary text-2xl text-center"
                    >
                      💧
                    </motion.div>
                  )}
                </div>

                {/* Incoming packet visualization */}
                {event?.packet && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-semibold ${
                      event.packet.accepted
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    📦 Size: {event.packet.size}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-background-elevated rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono text-text-secondary">Time: {event?.time || 0}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event?.type === 'ARRIVAL'
                      ? 'bg-blue-500/20 text-blue-500'
                      : event?.type === 'LEAK'
                      ? 'bg-green-500/20 text-green-500'
                      : event?.type === 'DROP'
                      ? 'bg-red-500/20 text-red-500'
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
              <label className="block text-sm font-medium mb-2">
                Bucket Capacity: {bucketCapacity}
              </label>
              <Slider
                min={5}
                max={20}
                step={1}
                value={bucketCapacity}
                onChange={(val) => setBucketCapacity(val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Leak Rate: {leakRate} units/time
              </label>
              <Slider
                min={1}
                max={5}
                step={1}
                value={leakRate}
                onChange={(val) => setLeakRate(val)}
              />
            </div>
            <Button onClick={runSimulation} className="w-full">
              Generate New Simulation
            </Button>
          </div>
        </Card>

        <Card title="Metrics">
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Arrived:</span>
              <span className="font-semibold">{event?.metrics.totalArrived || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Accepted:</span>
              <span className="font-semibold text-green-500">{event?.metrics.totalAccepted || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Dropped:</span>
              <span className="font-semibold text-red-500">{event?.metrics.totalDropped || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Leaked:</span>
              <span className="font-semibold">{event?.metrics.totalLeaked || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Current Size:</span>
              <span className="font-semibold">{event?.bucketState.currentSize || 0}</span>
            </div>
          </div>
        </Card>

        <Card title="About Leaky Bucket">
          <div className="p-4 text-sm text-text-secondary space-y-2">
            <p>
              The Leaky Bucket algorithm is a traffic shaping mechanism that controls
              the rate at which packets are sent to the network.
            </p>
            <p>
              Packets arrive at variable rates but are transmitted at a constant rate,
              smoothing out bursts. If the bucket overflows, packets are dropped.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeakyBucketSimulator;
