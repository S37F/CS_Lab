import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCSMACDSimulation, type CSMACD_SimulationEvent } from '../../services/csmacdService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';
import Slider from '../../components/ui/Slider';

const CSMACDSimulator: React.FC = () => {
  const [nodeCount, setNodeCount] = useState(4);
  const [simulation, setSimulation] = useState<CSMACD_SimulationEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = useCallback(() => {
    // Generate transmission attempts for nodes
    const attempts = Array.from({ length: nodeCount }, (_, i) => ({
      node: i,
      startTime: Math.floor(Math.random() * 8) + 1,
    }));
    
    const events = generateCSMACDSimulation(nodeCount, attempts);
    setSimulation(events);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nodeCount]);

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
  }, isPlaying ? 600 : null);

  const event = simulation[currentStep];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="CSMA/CD Simulation">
          <div className="p-6 space-y-6">
            {/* Channel Status */}
            <div className="bg-background-elevated rounded-lg p-4">
              <h3 className="font-semibold mb-3">Channel Status</h3>
              <div className={`h-12 rounded-lg flex items-center justify-center font-semibold text-lg transition-colors ${
                event?.channelBusy 
                  ? 'bg-accent-primary text-white' 
                  : 'bg-border text-text-secondary'
              }`}>
                {event?.channelBusy ? 'BUSY' : 'IDLE'}
              </div>
              {event?.collisionDetected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-3 bg-red-500 text-white rounded-lg p-3 text-center font-semibold"
                >
                  ⚠️ COLLISION DETECTED!
                </motion.div>
              )}
            </div>

            {/* Nodes Visualization */}
            <div className="bg-background-elevated rounded-lg p-4">
              <h3 className="font-semibold mb-4">Network Nodes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event?.nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    layout
                    className={`p-4 rounded-lg border-2 text-center ${
                      node.status === 'transmitting'
                        ? 'border-accent-primary bg-accent-primary/20'
                        : node.status === 'collision'
                        ? 'border-red-500 bg-red-500/20'
                        : node.status === 'success'
                        ? 'border-green-500 bg-green-500/20'
                        : node.status === 'waiting'
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="font-mono text-2xl mb-2">Node {node.id}</div>
                    <div className="text-sm font-semibold capitalize">{node.status}</div>
                    {node.backoffTime !== undefined && node.backoffTime > 0 && (
                      <div className="text-xs mt-2 text-text-secondary">
                        Backoff: {node.backoffTime}
                      </div>
                    )}
                    {node.attemptsCount !== undefined && node.attemptsCount > 0 && (
                      <div className="text-xs mt-1 text-text-secondary">
                        Attempts: {node.attemptsCount}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-background-elevated rounded-lg p-4">
              <div className="text-sm font-mono text-text-secondary">
                Time: {event?.time || 0}
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
                Number of Nodes: {nodeCount}
              </label>
              <Slider
                min={2}
                max={6}
                step={1}
                value={nodeCount}
                onChange={(val) => setNodeCount(val)}
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
              <span className="text-text-secondary">Total Collisions:</span>
              <span className="font-semibold">{event?.metrics.totalCollisions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Successful Transmissions:</span>
              <span className="font-semibold">{event?.metrics.successfulTransmissions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Attempts:</span>
              <span className="font-semibold">{event?.metrics.totalAttempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Success Rate:</span>
              <span className="font-semibold">
                {event?.metrics.totalAttempts > 0
                  ? `${Math.round((event.metrics.successfulTransmissions / event.metrics.totalAttempts) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="About CSMA/CD">
          <div className="p-4 text-sm text-text-secondary space-y-2">
            <p>
              CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is a network protocol
              for carrier transmission access in Ethernet networks.
            </p>
            <p>
              When a collision is detected, nodes wait for a random backoff time using binary
              exponential backoff before retransmitting.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CSMACDSimulator;
