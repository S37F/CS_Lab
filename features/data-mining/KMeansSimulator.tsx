import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getKMeansSimulation, type Point } from '../../services/kMeansService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

// Color palette for different clusters
const CLUSTER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

const KMeansSimulator: React.FC = () => {
  const [k, setK] = useState<number>(3);
  const [numPoints, setNumPoints] = useState<number>(50);
  const [points, setPoints] = useState<Point[]>([]);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Generate random points
  const generateRandomPoints = useCallback(() => {
    const newPoints: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
      newPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setPoints(newPoints);
  }, [numPoints]);

  // Generate clustered points (more realistic data)
  const generateClusteredPoints = useCallback(() => {
    const newPoints: Point[] = [];
    const numClusters = Math.min(k, 5); // Create natural clusters
    
    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;
      const pointsPerCluster = Math.floor(numPoints / numClusters);
      
      for (let i = 0; i < pointsPerCluster; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 15;
        newPoints.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      }
    }
    
    // Add remaining points
    while (newPoints.length < numPoints) {
      newPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    
    setPoints(newPoints);
  }, [numPoints, k]);

  // Initialize with clustered points
  useEffect(() => {
    generateClusteredPoints();
  }, []);

  // Run simulation
  const runSimulation = useCallback(() => {
    if (points.length > 0 && k > 0 && k <= points.length) {
      const simData = getKMeansSimulation(points, k);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [points, k]);

  useEffect(() => {
    if (points.length > 0) {
      runSimulation();
    }
  }, [points, k, runSimulation]);

  const handleStep = (dir: number) => {
    if (!simulation) return;
    const nextStep = currentStep + dir;
    if (nextStep >= 0 && nextStep < simulation.steps.length) {
      setCurrentStep(nextStep);
    }
    setIsPlaying(false);
  };

  useInterval(() => {
    if (isPlaying && simulation && currentStep < simulation.steps.length - 1) {
      handleStep(1);
    } else {
      setIsPlaying(false);
    }
  }, isPlaying ? 800 : null);

  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

  // SVG viewBox dimensions
  const viewBoxSize = 100;
  const padding = 5;

  // Calculate bounds for better visualization
  const { minX, maxX, minY, maxY } = useMemo(() => {
    if (points.length === 0) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    }
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return {
      minX: Math.min(...xs) - padding,
      maxX: Math.max(...xs) + padding,
      minY: Math.min(...ys) - padding,
      maxY: Math.max(...ys) + padding
    };
  }, [points]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Cluster Visualization">
          <div className="p-4">
            {stepData && (
              <div className="bg-background-elevated rounded-lg p-4">
                <svg
                  viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
                  className="w-full h-[500px] bg-gray-900 rounded"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map(val => (
                    <React.Fragment key={val}>
                      <line
                        x1={val}
                        y1={minY}
                        x2={val}
                        y2={maxY}
                        stroke="#374151"
                        strokeWidth="0.3"
                        opacity="0.3"
                      />
                      <line
                        x1={minX}
                        y1={val}
                        x2={maxX}
                        y2={val}
                        stroke="#374151"
                        strokeWidth="0.3"
                        opacity="0.3"
                      />
                    </React.Fragment>
                  ))}

                  {/* Data points */}
                  {stepData.state.points.map((point: Point, idx: number) => {
                    const color = point.cluster !== undefined 
                      ? CLUSTER_COLORS[point.cluster % CLUSTER_COLORS.length]
                      : '#9ca3af';
                    return (
                      <circle
                        key={idx}
                        cx={point.x}
                        cy={point.y}
                        r="1.5"
                        fill={color}
                        opacity="0.7"
                        stroke="#1f2937"
                        strokeWidth="0.3"
                      />
                    );
                  })}

                  {/* Centroids */}
                  {stepData.state.centroids?.map((centroid: any, idx: number) => {
                    const color = CLUSTER_COLORS[centroid.cluster % CLUSTER_COLORS.length];
                    return (
                      <g key={`centroid-${idx}`}>
                        {/* Centroid marker */}
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="2.5"
                          fill={color}
                          stroke="#fff"
                          strokeWidth="0.6"
                        />
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="1"
                          fill="#fff"
                        />
                        {/* Label */}
                        <text
                          x={centroid.x}
                          y={centroid.y - 4}
                          fontSize="3"
                          fill="#fff"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          C{centroid.cluster}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <p className="text-sm text-center font-mono text-text-secondary">
              {stepData?.description}
            </p>
          </div>
        </Card>

        <Card title="Educational Notes">
          <div className="p-4">
            {stepData?.educational_notes && stepData.educational_notes.length > 0 ? (
              <ul className="space-y-2">
                {stepData.educational_notes.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span className="text-sm text-text-secondary">{note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-text-tertiary">No notes available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card title="Controls">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Number of Clusters (k): {k}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={k}
                onChange={e => setK(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Number of Points: {numPoints}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={numPoints}
                onChange={e => setNumPoints(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generateClusteredPoints} className="flex-1">
                <RefreshIcon className="w-4 h-4 mr-2" />
                Generate Clustered
              </Button>
              <Button onClick={generateRandomPoints} variant="secondary" className="flex-1">
                <RefreshIcon className="w-4 h-4 mr-2" />
                Random
              </Button>
            </div>

            <Button onClick={runSimulation} className="w-full" variant="primary">
              Run K-Means
            </Button>

            <div className="flex items-center justify-around pt-2 border-t border-border">
              <Button 
                onClick={() => handleStep(-1)} 
                variant="ghost" 
                size="lg" 
                disabled={currentStep <= 0}
              >
                <StepForwardIcon className="w-5 h-5 transform rotate-180"/>
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)} 
                variant="primary" 
                size="lg"
              >
                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
              </Button>
              <Button 
                onClick={() => handleStep(1)} 
                variant="ghost" 
                size="lg" 
                disabled={!simulation || currentStep >= simulation.steps.length - 1}
              >
                <StepForwardIcon className="w-5 h-5"/>
              </Button>
            </div>

            <div className="text-center text-sm text-text-tertiary">
              Step {currentStep + 1} of {simulation?.steps.length || 0}
            </div>
          </div>
        </Card>

        <Card title="Metrics">
          {stepData && (
            <div className="font-mono text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Iteration:</span>
                <span className="text-text-primary">{stepData.state.iteration || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">SSE:</span>
                <span className="text-accent-primary font-bold">
                  {stepData.metrics.sse?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Converged:</span>
                <span className={stepData.state.converged ? 'text-green-400' : 'text-yellow-400'}>
                  {stepData.state.converged ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="text-text-tertiary mb-2">Cluster Sizes:</div>
                {stepData.metrics.clusterSizes?.map((size: number, idx: number) => (
                  <div key={idx} className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}
                      />
                      <span className="text-text-tertiary">Cluster {idx}:</span>
                    </div>
                    <span className="text-text-primary">{size}</span>
                  </div>
                ))}
              </div>
              {stepData.metrics.centroidMovement && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="text-text-tertiary mb-2">Centroid Movement:</div>
                  {stepData.metrics.centroidMovement.map((movement: number, idx: number) => (
                    <div key={idx} className="flex justify-between mb-1">
                      <span className="text-text-tertiary">C{idx}:</span>
                      <span className="text-text-primary">{movement.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card title="Legend">
          <div className="p-4 space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-400 mr-3" />
              <span className="text-sm text-text-secondary">Data Point</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white mr-3" />
              <span className="text-sm text-text-secondary">Centroid</span>
            </div>
            <div className="text-xs text-text-tertiary mt-3">
              Points are colored by their assigned cluster
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KMeansSimulator;
