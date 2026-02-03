import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  generateDistanceVectorSimulation,
  getDefaultTopology,
  type DVR_SimulationEvent,
  type Router,
  type Link,
} from '../../services/distanceVectorRoutingService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const DistanceVectorRoutingSimulator: React.FC = () => {
  const [simulation, setSimulation] = useState<DVR_SimulationEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [topology, setTopology] = useState(getDefaultTopology());

  const runSimulation = useCallback(() => {
    const events = generateDistanceVectorSimulation(topology.routers, topology.links);
    setSimulation(events);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [topology]);

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
  }, isPlaying ? 800 : null);

  const event = simulation[currentStep];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Distance Vector Routing Simulation">
          <div className="p-6 space-y-6">
            {/* Network Topology Visualization */}
            <div className="bg-background-elevated rounded-lg p-6">
              <h3 className="font-semibold mb-4">Network Topology</h3>
              <svg viewBox="0 0 600 350" className="w-full h-[300px]">
                {/* Draw links */}
                {topology.links.map((link, idx) => {
                  const fromRouter = topology.routers.find(r => r.id === link.from);
                  const toRouter = topology.routers.find(r => r.id === link.to);
                  if (!fromRouter || !toRouter) return null;

                  const midX = (fromRouter.position.x + toRouter.position.x) / 2;
                  const midY = (fromRouter.position.y + toRouter.position.y) / 2;

                  return (
                    <g key={idx}>
                      <line
                        x1={fromRouter.position.x}
                        y1={fromRouter.position.y}
                        x2={toRouter.position.x}
                        y2={toRouter.position.y}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border"
                      />
                      <circle
                        cx={midX}
                        cy={midY}
                        r="15"
                        fill="currentColor"
                        className="text-background-elevated"
                      />
                      <text
                        x={midX}
                        y={midY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-semibold fill-current"
                      >
                        {link.cost}
                      </text>
                    </g>
                  );
                })}

                {/* Draw routers */}
                {topology.routers.map((router) => (
                  <g key={router.id}>
                    <motion.circle
                      cx={router.position.x}
                      cy={router.position.y}
                      r="30"
                      fill="currentColor"
                      className={`${
                        event?.updatedRouters.includes(router.id)
                          ? 'text-accent-primary'
                          : 'text-border'
                      }`}
                      animate={
                        event?.updatedRouters.includes(router.id)
                          ? { scale: [1, 1.1, 1] }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    />
                    <text
                      x={router.position.x}
                      y={router.position.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xl font-bold fill-white pointer-events-none"
                    >
                      {router.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Event Description */}
            <div className="bg-background-elevated rounded-lg p-4">
              <div className="text-sm font-mono text-text-secondary">
                Iteration: {event?.iteration || 0}
              </div>
              <div className="mt-2 font-medium">{event?.description}</div>
              {event?.converged && (
                <div className="mt-3 bg-green-500 text-white rounded-lg p-3 text-center font-semibold">
                  ✓ Network Converged!
                </div>
              )}
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
        <Card title="Routing Tables">
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {event?.routingTables &&
              Array.from(event.routingTables.entries()).map(([routerId, entries]) => (
                <div key={routerId} className="border border-border rounded-lg p-3">
                  <h4 className="font-semibold mb-2">Router {routerId}</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-1">Dest</th>
                        <th className="text-left py-1">Cost</th>
                        <th className="text-left py-1">Next Hop</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries
                        .sort((a, b) => a.destination.localeCompare(b.destination))
                        .map((entry, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="py-1 font-mono">{entry.destination}</td>
                            <td className="py-1 font-mono">{entry.cost}</td>
                            <td className="py-1 font-mono">{entry.nextHop}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        </Card>

        <Card title="About Distance Vector">
          <div className="p-4 text-sm text-text-secondary space-y-2">
            <p>
              Distance Vector Routing uses the Bellman-Ford algorithm where each router
              maintains a table of distances to all destinations.
            </p>
            <p>
              Routers periodically exchange their routing tables with neighbors, allowing
              the network to converge to optimal paths.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DistanceVectorRoutingSimulator;
