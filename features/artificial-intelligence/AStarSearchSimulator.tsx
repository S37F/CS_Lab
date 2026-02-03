
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getAStarSimulation, HeuristicType } from '../../services/aStarSearchService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Slider from '../../components/ui/Slider';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

type CellMode = 'start' | 'goal' | 'obstacle' | null;

const AStarSearchSimulator: React.FC = () => {
  const [gridSize] = useState<number>(12);
  const [start, setStart] = useState<{row: number, col: number}>({ row: 1, col: 1 });
  const [goal, setGoal] = useState<{row: number, col: number}>({ row: 10, col: 10 });
  const [obstacles, setObstacles] = useState<Array<{row: number, col: number}>>([
    { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 },
    { row: 4, col: 6 }, { row: 5, col: 6 }, { row: 6, col: 6 }, { row: 7, col: 6 },
    { row: 8, col: 3 }, { row: 8, col: 4 }, { row: 8, col: 5 }, { row: 8, col: 6 }
  ]);
  const [heuristicType, setHeuristicType] = useState<HeuristicType>('manhattan');
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  const [cellMode, setCellMode] = useState<CellMode>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const intervalDelay = useMemo(() => 1000 - (speed * 9.5), [speed]);

  const runSimulation = useCallback(() => {
    const simData = getAStarSimulation(gridSize, obstacles, start, goal, heuristicType);
    setSimulation(simData);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [gridSize, obstacles, start, goal, heuristicType]);
  
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleReset = () => {
    setStart({ row: 1, col: 1 });
    setGoal({ row: 10, col: 10 });
    setObstacles([
      { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 },
      { row: 4, col: 6 }, { row: 5, col: 6 }, { row: 6, col: 6 }, { row: 7, col: 6 },
      { row: 8, col: 3 }, { row: 8, col: 4 }, { row: 8, col: 5 }, { row: 8, col: 6 }
    ]);
    setCellMode(null);
  };

  const handleStepForward = () => {
    if (simulation && currentStep < simulation.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  useInterval(() => {
    if (isPlaying && simulation && currentStep < simulation.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, isPlaying ? intervalDelay : null);
  
  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

  const handleCellClick = (row: number, col: number) => {
    if (cellMode === 'start') {
      setStart({ row, col });
      setCellMode(null);
    } else if (cellMode === 'goal') {
      setGoal({ row, col });
      setCellMode(null);
    } else if (cellMode === 'obstacle') {
      const key = `${row},${col}`;
      const isObstacle = obstacles.some(obs => obs.row === row && obs.col === col);
      if (isObstacle) {
        setObstacles(obstacles.filter(obs => !(obs.row === row && obs.col === col)));
      } else if (!(row === start.row && col === start.col) && !(row === goal.row && col === goal.col)) {
        setObstacles([...obstacles, { row, col }]);
      }
    }
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDrawing && cellMode === 'obstacle') {
      const isObstacle = obstacles.some(obs => obs.row === row && obs.col === col);
      if (!isObstacle && !(row === start.row && col === start.col) && !(row === goal.row && col === goal.col)) {
        setObstacles([...obstacles, { row, col }]);
      }
    }
  };

  const getCellColor = (row: number, col: number) => {
    const isStart = row === start.row && col === start.col;
    const isGoal = row === goal.row && col === goal.col;
    const isObstacle = obstacles.some(obs => obs.row === row && obs.col === col);
    
    if (isStart) return 'bg-green-500';
    if (isGoal) return 'bg-red-500';
    if (isObstacle) return 'bg-gray-800';
    
    if (stepData) {
      const isInPath = stepData.state.path?.some((p: any) => p.row === row && p.col === col);
      const isCurrent = stepData.state.currentNode?.row === row && stepData.state.currentNode?.col === col;
      const isInOpenList = stepData.state.openList?.some((n: any) => n.position.row === row && n.position.col === col);
      const isInClosedList = stepData.state.closedList?.some((n: any) => n.row === row && n.col === col);
      const isNeighbor = stepData.state.neighbors?.some((n: any) => n.row === row && n.col === col);
      
      if (isInPath) return 'bg-green-300';
      if (isCurrent) return 'bg-yellow-400';
      if (isNeighbor) return 'bg-purple-300';
      if (isInOpenList) return 'bg-blue-400';
      if (isInClosedList) return 'bg-gray-400';
    }
    
    return 'bg-background-elevated border-border';
  };

  const getCellValues = (row: number, col: number) => {
    if (!stepData?.state.nodeValues) return null;
    const key = `${row},${col}`;
    return stepData.state.nodeValues[key];
  };

  const grid = useMemo(() => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      const cols = [];
      for (let j = 0; j < gridSize; j++) {
        cols.push({ row: i, col: j });
      }
      rows.push(cols);
    }
    return rows;
  }, [gridSize]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="min-h-[600px]">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center p-4">
              <div 
                className="inline-grid gap-0.5"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                onMouseLeave={() => setIsDrawing(false)}
              >
                {grid.map((row, i) => (
                  row.map((cell, j) => {
                    const values = getCellValues(cell.row, cell.col);
                    return (
                      <motion.div
                        key={`${i}-${j}`}
                        className={`w-12 h-12 border border-gray-600 cursor-pointer flex flex-col items-center justify-center text-xs font-mono ${getCellColor(cell.row, cell.col)}`}
                        onClick={() => handleCellClick(cell.row, cell.col)}
                        onMouseDown={() => {
                          if (cellMode === 'obstacle') setIsDrawing(true);
                          handleCellClick(cell.row, cell.col);
                        }}
                        onMouseEnter={() => handleCellMouseEnter(cell.row, cell.col)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.1 }}
                      >
                        {values && (
                          <div className="text-[8px] leading-tight text-gray-900 font-semibold">
                            <div>f:{values.f.toFixed(1)}</div>
                            <div>g:{values.g.toFixed(1)}</div>
                            <div>h:{values.h.toFixed(1)}</div>
                          </div>
                        )}
                        {cell.row === start.row && cell.col === start.col && <span className="text-white font-bold">S</span>}
                        {cell.row === goal.row && cell.col === goal.col && <span className="text-white font-bold">G</span>}
                      </motion.div>
                    );
                  })
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <p className="text-sm text-center font-mono text-text-secondary min-h-[40px]">
                {stepData?.description}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-4">
        <Card title="Grid Setup">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => setCellMode(cellMode === 'start' ? null : 'start')} 
                variant={cellMode === 'start' ? 'primary' : 'secondary'}
                className="text-sm"
              >
                Set Start
              </Button>
              <Button 
                onClick={() => setCellMode(cellMode === 'goal' ? null : 'goal')} 
                variant={cellMode === 'goal' ? 'primary' : 'secondary'}
                className="text-sm"
              >
                Set Goal
              </Button>
            </div>
            <Button 
              onClick={() => setCellMode(cellMode === 'obstacle' ? null : 'obstacle')} 
              variant={cellMode === 'obstacle' ? 'primary' : 'secondary'}
              className="w-full text-sm"
            >
              {cellMode === 'obstacle' ? 'Drawing Obstacles' : 'Draw Obstacles'}
            </Button>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">Heuristic</label>
              <select 
                className="w-full bg-background-elevated border border-border rounded-md p-2 text-sm text-text-primary"
                value={heuristicType}
                onChange={(e) => setHeuristicType(e.target.value as HeuristicType)}
              >
                <option value="manhattan">Manhattan</option>
                <option value="euclidean">Euclidean</option>
                <option value="chebyshev">Chebyshev</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runSimulation} variant="primary" className="flex-1">Run A*</Button>
              <Button onClick={handleReset} variant="secondary" className="flex-1">Reset</Button>
            </div>
          </div>
        </Card>

        <Card title="Controls">
          <div className="space-y-4">
            <div className="flex items-center justify-around">
              <Button onClick={handleStepBackward} variant="ghost" size="lg" disabled={currentStep === 0}>
                <StepForwardIcon className="w-5 h-5 rotate-180" />
              </Button>
              <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
              </Button>
              <Button onClick={handleStepForward} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                <StepForwardIcon className="w-5 h-5"/>
              </Button>
            </div>
            <Slider 
              label="Speed"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </Card>

        <Card title="Metrics">
          {stepData && (
            <div className="font-mono text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Step:</span>
                <span className="text-text-primary">{currentStep} / {simulation!.steps.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Nodes Explored:</span>
                <span className="text-text-primary">{stepData.metrics.nodesExplored}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Path Length:</span>
                <span className="text-text-primary">{stepData.metrics.pathLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Path Cost:</span>
                <span className="text-text-primary">{stepData.metrics.pathCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Open List:</span>
                <span className="text-text-primary">{stepData.metrics.openListSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Closed List:</span>
                <span className="text-text-primary">{stepData.metrics.closedListSize}</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="Open List (Priority Queue)">
          <div className="font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
            {stepData?.state.openList?.slice(0, 10).map((node: any, i: number) => (
              <div key={i} className="bg-blue-400/20 p-2 rounded-md flex justify-between">
                <span className="text-text-primary">({node.position.row},{node.position.col})</span>
                <span className="text-text-secondary">f={node.f.toFixed(1)}</span>
              </div>
            ))}
            {stepData?.state.openList?.length === 0 && <p className="text-text-tertiary text-center">Empty</p>}
            {stepData?.state.openList?.length > 10 && (
              <p className="text-text-tertiary text-center text-[10px]">...and {stepData.state.openList.length - 10} more</p>
            )}
          </div>
        </Card>

        <Card title="Legend">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 border border-gray-600"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 border border-gray-600"></div>
              <span>Goal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-800 border border-gray-600"></div>
              <span>Obstacle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 border border-gray-600"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-400 border border-gray-600"></div>
              <span>Open List</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 border border-gray-600"></div>
              <span>Closed List</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-300 border border-gray-600"></div>
              <span>Path</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-300 border border-gray-600"></div>
              <span>Neighbor</span>
            </div>
          </div>
        </Card>

        <Card title="Educational Notes">
          <div className="text-sm text-text-secondary max-h-32 overflow-y-auto">
            {stepData?.educational_notes && stepData.educational_notes.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {stepData.educational_notes.map((note, idx) => <li key={idx}>{note}</li>)}
              </ul>
            ) : (
              <p>No notes for this step.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AStarSearchSimulator;
