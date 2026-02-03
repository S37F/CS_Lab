import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getDBSCANSimulation, type Point } from '../../services/dbscanService';
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

const NOISE_COLOR = '#6b7280'; // gray

const DBSCANSimulator: React.FC = () => {
  const [eps, setEps] = useState<number>(10);
  const [minPts, setMinPts] = useState<number>(3);
  const [numPoints, setNumPoints] = useState<number>(50);
  const [points, setPoints] = useState<Point[]>([]);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showEpsRadius, setShowEpsRadius] = useState<boolean>(true);

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

  // Generate clustered points (more realistic data for DBSCAN)
  const generateClusteredPoints = useCallback(() => {
    const newPoints: Point[] = [];
    const numClusters = 3;
    
    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;
      const pointsPerCluster = Math.floor(numPoints * 0.8 / numClusters);
      
      for (let i = 0; i < pointsPerCluster; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 12;
        newPoints.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      }
    }
    
    // Add noise points
    const noisePoints = Math.floor(numPoints * 0.2);
    for (let i = 0; i < noisePoints; i++) {
      newPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    
    setPoints(newPoints);
  }, [numPoints]);

  // Initialize with clustered points
  useEffect(() => {
    generateClusteredPoints();
  }, []);

  // Run simulation
  const runSimulation = useCallback(() => {
    if (points.length > 0 && eps > 0 && minPts > 0) {
      const simData = getDBSCANSimulation(points, eps, minPts);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [points, eps, minPts]);

  useEffect(() => {
    if (points.length > 0) {
      runSimulation();
    }
  }, [points, eps, minPts, runSimulation]);

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

                  {/* Eps radius circle for current point */}
                  {showEpsRadius && stepData.state.currentPoint !== undefined && (
                    <circle
                      cx={stepData.state.points[stepData.state.currentPoint].x}
                      cy={stepData.state.points[stepData.state.currentPoint].y}
                      r={eps}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      opacity="0.5"
                    />
                  )}

                  {/* Data points */}
                  {stepData.state.points.map((point: Point, idx: number) => {
                    let color = NOISE_COLOR;
                    let strokeColor = '#1f2937';
                    let strokeWidth = 0.3;
                    let radius = 1.5;
                    
                    // Color based on cluster assignment
                    if (point.cluster !== undefined) {
                      color = CLUSTER_COLORS[point.cluster % CLUSTER_COLORS.length];
                    }
                    
                    // Highlight current point
                    if (idx === stepData.state.currentPoint) {
                      strokeColor = '#fbbf24';
                      strokeWidth = 0.8;
                      radius = 2;
                    }
                    
                    // Different shapes for point types
                    const isCorePoint = point.pointType === 'core';
                    const isBorderPoint = point.pointType === 'border';
                    const isNoisePoint = point.pointType === 'noise';
                    
                    return (
                      <g key={idx}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={radius}
                          fill={color}
                          opacity={isNoisePoint ? 0.4 : 0.8}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                        />
                        {/* Core point indicator - inner circle */}
                        {isCorePoint && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="0.6"
                            fill="#fff"
                            opacity="0.8"
                          />
                        )}
                        {/* Border point indicator - ring */}
                        {isBorderPoint && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="1"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="0.3"
                            opacity="0.6"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Highlight neighbors */}
                  {stepData.state.neighbors && stepData.state.currentPoint !== undefined && (
                    <>
                      {stepData.state.neighbors.map((neighborIdx: number) => (
                        <line
                          key={`neighbor-${neighborIdx}`}
                          x1={stepData.state.points[stepData.state.currentPoint!].x}
                          y1={stepData.state.points[stepData.state.currentPoint!].y}
                          x2={stepData.state.points[neighborIdx].x}
                          y2={stepData.state.points[neighborIdx].y}
                          stroke="#fbbf24"
                          strokeWidth="0.3"
                          opacity="0.3"
                        />
                      ))}
                    </>
                  )}
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
                Epsilon (eps): {eps.toFixed(1)}
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={eps}
                onChange={e => setEps(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Maximum neighborhood radius</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Min Points: {minPts}
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={minPts}
                onChange={e => setMinPts(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Minimum points to form cluster</p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Number of Points: {numPoints}
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={numPoints}
                onChange={e => setNumPoints(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showEpsRadius"
                checked={showEpsRadius}
                onChange={e => setShowEpsRadius(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showEpsRadius" className="text-sm text-text-secondary">
                Show eps radius
              </label>
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
              Run DBSCAN
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
                <span className="text-text-tertiary">Clusters Found:</span>
                <span className="text-accent-primary font-bold">
                  {stepData.metrics.clustersFound || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Core Points:</span>
                <span className="text-green-400">
                  {stepData.metrics.corePoints || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Border Points:</span>
                <span className="text-blue-400">
                  {stepData.metrics.borderPoints || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Noise Points:</span>
                <span className="text-gray-400">
                  {stepData.metrics.noisePoints || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Visited:</span>
                <span className="text-text-primary">
                  {stepData.metrics.visitedCount || 0} / {points.length}
                </span>
              </div>
              
              {stepData.metrics.clusterSizes && stepData.metrics.clusterSizes.length > 0 && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="text-text-tertiary mb-2">Cluster Sizes:</div>
                  {stepData.metrics.clusterSizes.map((size: number, idx: number) => (
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
              )}

              {stepData.state.currentPoint !== undefined && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Current Point:</span>
                    <span className="text-yellow-400">{stepData.state.currentPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Neighbors:</span>
                    <span className="text-text-primary">
                      {stepData.metrics.currentNeighborCount || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card title="Legend">
          <div className="p-4 space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-3 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <span className="text-sm text-text-secondary">Core Point (cluster color)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-3 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full border border-white" style={{ background: 'transparent' }} />
                </div>
              </div>
              <span className="text-sm text-text-secondary">Border Point (cluster color)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-500 opacity-40 mr-3" />
              <span className="text-sm text-text-secondary">Noise Point</span>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-8 h-4 border-2 border-yellow-400 border-dashed rounded-full mr-3 opacity-50" />
              <span className="text-sm text-text-secondary">Epsilon radius (when enabled)</span>
            </div>
            <div className="text-xs text-text-tertiary mt-3">
              DBSCAN finds clusters based on density
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DBSCANSimulator;