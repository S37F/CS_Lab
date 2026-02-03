
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getBFSSimulation, 
  getDFSSimulation, 
  PREDEFINED_PUZZLES,
  type PuzzleState,
  type SearchType 
} from '../../services/stateSpaceSearchService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Slider from '../../components/ui/Slider';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const StateSpaceSearchSimulator: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>('BFS');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'veryHard'>('easy');
  const [initialState, setInitialState] = useState<PuzzleState>(PREDEFINED_PUZZLES.easy.initial);
  const [goalState] = useState<PuzzleState>(PREDEFINED_PUZZLES.easy.goal);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  
  const intervalDelay = useMemo(() => 1000 - (speed * 9.5), [speed]);

  const runSimulation = useCallback(() => {
    const simData = searchType === 'BFS' 
      ? getBFSSimulation(initialState, goalState)
      : getDFSSimulation(initialState, goalState);
    setSimulation(simData);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [searchType, initialState, goalState]);
  
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard' | 'veryHard') => {
    setDifficulty(newDifficulty);
    setInitialState(PREDEFINED_PUZZLES[newDifficulty].initial);
  };

  const handleReset = () => {
    setDifficulty('easy');
    setInitialState(PREDEFINED_PUZZLES.easy.initial);
    setSearchType('BFS');
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

  // Get tile color based on whether it's in the correct position
  const getTileColor = (value: number, row: number, col: number, state: PuzzleState): string => {
    if (value === 0) return 'bg-gray-800 border-gray-700';
    
    const isCorrect = goalState[row][col] === value;
    
    // Check if this tile is part of the current path
    const isInPath = stepData?.state?.path?.some((node: any) => 
      node.state[row][col] === value
    );
    
    if (isCorrect) {
      return 'bg-green-600 border-green-500 text-white';
    } else if (isInPath) {
      return 'bg-blue-500 border-blue-400 text-white';
    } else {
      return 'bg-gray-600 border-gray-500 text-white';
    }
  };

  // Render a 3x3 puzzle grid
  const renderPuzzle = (state: PuzzleState, title: string, highlight: boolean = false) => {
    if (!state) return null;
    
    return (
      <div className="flex flex-col items-center">
        <h4 className="text-xs font-semibold mb-2 text-text-secondary">{title}</h4>
        <div className="grid grid-cols-3 gap-1 p-2 bg-gray-900 rounded-lg">
          {state.map((row, i) => (
            row.map((value, j) => (
              <motion.div
                key={`${i}-${j}`}
                className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded ${getTileColor(value, i, j, state)} ${highlight ? 'ring-2 ring-yellow-400' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: (i * 3 + j) * 0.02 }}
              >
                {value !== 0 ? value : ''}
              </motion.div>
            ))
          ))}
        </div>
      </div>
    );
  };

  // Render frontier (queue for BFS, stack for DFS)
  const renderFrontier = () => {
    if (!stepData?.state?.frontier) return null;
    
    const frontierNodes = stepData.state.frontier.slice(0, 8); // Show first 8
    const isBFS = stepData.state.searchType === 'BFS';
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-secondary">
            {isBFS ? 'Queue (FIFO)' : 'Stack (LIFO)'}
          </h4>
          <span className="text-xs text-text-tertiary">
            {stepData.state.frontier.length} states
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1">
          <AnimatePresence>
            {frontierNodes.map((node: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-blue-500/20 border border-blue-500/50 rounded p-2"
              >
                <div className="grid grid-cols-3 gap-0.5">
                  {node.state.flat().map((val: number, i: number) => (
                    <div key={i} className="w-6 h-6 flex items-center justify-center text-[10px] bg-gray-700 rounded">
                      {val !== 0 ? val : ''}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-text-tertiary mt-1">Depth: {node.depth}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {stepData.state.frontier.length > 8 && (
            <p className="text-xs text-text-tertiary text-center">
              +{stepData.state.frontier.length - 8} more...
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render solution path
  const renderPath = () => {
    if (!stepData?.state?.path || stepData.state.path.length === 0) return null;
    
    const pathNodes = stepData.state.path.slice(-5); // Show last 5 states in path
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text-secondary">Current Path</h4>
          <span className="text-xs text-text-tertiary">
            {stepData.state.path.length} states
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {pathNodes.map((node: any, idx: number) => (
            <div key={idx} className="bg-green-500/20 border border-green-500/50 rounded p-2">
              <div className="grid grid-cols-3 gap-0.5">
                {node.state.flat().map((val: number, i: number) => (
                  <div key={i} className="w-6 h-6 flex items-center justify-center text-[10px] bg-gray-700 rounded">
                    {val !== 0 ? val : ''}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-tertiary mt-1">
                {node.action} (Depth: {node.depth})
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="min-h-[600px]">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current State */}
                <div className="flex flex-col items-center">
                  {renderPuzzle(
                    stepData?.state?.currentNode?.state || initialState,
                    stepData?.state?.currentNode ? `Current State (Depth: ${stepData.state.currentNode.depth})` : 'Initial State',
                    true
                  )}
                  {stepData?.state?.action && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm text-yellow-400 font-semibold"
                    >
                      {stepData.state.action}
                    </motion.div>
                  )}
                </div>

                {/* Goal State */}
                <div className="flex flex-col items-center">
                  {renderPuzzle(goalState, 'Goal State', stepData?.state?.goalFound)}
                  {stepData?.state?.goalFound && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3 text-2xl"
                    >
                      🎉
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border">
              <p className="text-sm text-center font-mono text-text-secondary min-h-[40px]">
                {stepData?.description || 'Configure the puzzle and click Run Simulation'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Card title="Configuration">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={searchType === 'BFS' ? 'primary' : 'secondary'}
                  onClick={() => setSearchType('BFS')}
                  className="w-full"
                >
                  BFS
                </Button>
                <Button
                  variant={searchType === 'DFS' ? 'primary' : 'secondary'}
                  onClick={() => setSearchType('DFS')}
                  className="w-full"
                >
                  DFS
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Puzzle Difficulty</label>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'medium', 'hard', 'veryHard'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? 'primary' : 'secondary'}
                    onClick={() => handleDifficultyChange(level)}
                    className="w-full text-xs"
                  >
                    {level === 'veryHard' ? 'Very Hard' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={runSimulation} className="w-full" variant="primary">
              Run Simulation
            </Button>
            <Button onClick={handleReset} className="w-full" variant="secondary">
              <RefreshIcon className="mr-2" />
              Reset
            </Button>
          </div>
        </Card>

        <Card title="Controls">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleStepBackward} 
                disabled={currentStep === 0}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!simulation || currentStep >= simulation.steps.length - 1}
                className="flex-1"
                variant="primary"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </Button>
              <Button 
                onClick={handleStepForward}
                disabled={!simulation || currentStep >= simulation.steps.length - 1}
                className="flex-1"
              >
                <StepForwardIcon />
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Speed: {speed}%
              </label>
              <Slider
                min={1}
                max={100}
                value={speed}
                onChange={(value) => setSpeed(value)}
              />
            </div>
            
            <div className="text-sm text-text-secondary">
              <p>Step {currentStep + 1} of {simulation?.steps.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card title="Metrics">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-tertiary">States Explored</p>
              <p className="text-lg font-bold text-primary">{stepData?.metrics?.visitedSize || 0}</p>
            </div>
            <div>
              <p className="text-text-tertiary">Frontier Size</p>
              <p className="text-lg font-bold text-blue-400">{stepData?.metrics?.frontierSize || 0}</p>
            </div>
            <div>
              <p className="text-text-tertiary">Current Depth</p>
              <p className="text-lg font-bold text-yellow-400">{stepData?.metrics?.depth || 0}</p>
            </div>
            <div>
              <p className="text-text-tertiary">Solution Depth</p>
              <p className="text-lg font-bold text-green-400">
                {stepData?.metrics?.solutionDepth !== undefined ? stepData.metrics.solutionDepth : '-'}
              </p>
            </div>
          </div>
        </Card>

        <Card title={`Frontier (${searchType === 'BFS' ? 'Queue' : 'Stack'})`}>
          {renderFrontier()}
        </Card>

        {stepData?.state?.path && stepData.state.path.length > 0 && (
          <Card title="Solution Path">
            {renderPath()}
          </Card>
        )}

        <Card title="Algorithm Info">
          <div className="text-sm space-y-2">
            <div>
              <p className="font-semibold text-text-secondary">
                {searchType === 'BFS' ? 'Breadth-First Search' : 'Depth-First Search'}
              </p>
              <p className="text-text-tertiary text-xs mt-1">
                {searchType === 'BFS' 
                  ? 'Uses a queue (FIFO) to explore level by level. Guarantees shortest path.'
                  : 'Uses a stack (LIFO) to explore depth-first. Does not guarantee shortest path.'}
              </p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-text-tertiary">
                <strong>Time:</strong> {simulation?.metadata?.complexity?.time || 'N/A'}
              </p>
              <p className="text-xs text-text-tertiary">
                <strong>Space:</strong> {simulation?.metadata?.complexity?.space || 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Educational Notes">
          <div className="text-sm text-text-secondary max-h-40 overflow-y-auto">
            {stepData?.educational_notes && stepData.educational_notes.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {stepData.educational_notes.map((note, idx) => (
                  <li key={idx} className="text-xs">{note}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs">No notes for this step.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StateSpaceSearchSimulator;
