
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMergeSortSimulation } from '../../services/mergeSortService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Slider from '../../components/ui/Slider';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const MergeSortSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('38, 27, 43, 3, 9, 82, 10');
  const [array, setArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);

  const intervalDelay = useMemo(() => 1000 - (speed * 9.5), [speed]);

  const runSimulation = useCallback(() => {
    const parsedArray = inputValue.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsedArray.length > 0) {
      setArray(parsedArray);
      const simData = getMergeSortSimulation(parsedArray);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [inputValue]);

  useEffect(() => {
    runSimulation();
  }, []);

  const handleReset = () => {
    runSimulation();
  };

  const handleStepForward = () => {
    if (simulation && currentStep < simulation.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
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
  const maxValue = useMemo(() => Math.max(...array, 1), [array]);

  const getBarColor = (index: number) => {
    if (stepData?.state.highlights.sorted?.includes(index)) return 'bg-accent-success';
    if (stepData?.state.highlights.placed?.includes(index)) return 'bg-yellow-500';
    if (stepData?.state.highlights.comparing?.includes(index)) return 'bg-accent-warning';
    if (stepData?.state.highlights.merging?.includes(index)) return 'bg-accent-primary';
    return 'bg-border';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="min-h-[500px]">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col items-center justify-end p-4 space-y-4" style={{ minHeight: '350px' }}>
               {stepData?.state.subarrays && stepData.state.subarrays.length > 0 && (
                <div className="flex space-x-8 mb-4">
                  {stepData.state.subarrays.map((sub: any, idx: number) => (
                    <div key={idx} className="p-2 border border-dashed border-border rounded">
                      <h4 className="text-xs text-text-tertiary mb-2">{sub.name} Array</h4>
                      <div className="flex items-end justify-center space-x-1">
                          {sub.arr.map((val: number, s_idx: number) => (
                              <div key={s_idx} className="flex flex-col items-center">
                                  <div className="w-6 h-6 bg-background-elevated rounded-sm flex items-center justify-center text-xs font-mono">{val}</div>
                              </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end justify-center space-x-2">
                {stepData && (
                  <AnimatePresence>
                    {stepData.state.array.map((value: number, index: number) => (
                      <motion.div
                        key={index}
                        
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-8 md:w-10 rounded-t-md transition-colors duration-300 ${getBarColor(index)}`}
                          style={{ height: `${(value / maxValue) * 100 * 2.5 + 20}px` }}
                        />
                        <span className="text-sm font-mono mt-2 text-text-secondary">{value}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-border mt-4">
              <p className="text-sm text-center font-mono text-text-secondary h-5">
                {stepData?.description}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card title="Controls">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Input Array (comma-separated)</label>
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., 5, 2, 8, 1"
                  className="font-mono"
                />
                <Button onClick={runSimulation}>Run</Button>
              </div>
            </div>
            <div className="flex items-center justify-around pt-2">
              <Button onClick={handleReset} variant="ghost" size="lg"><RefreshIcon className="w-5 h-5" /></Button>
              <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </Button>
              <Button onClick={handleStepForward} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                <StepForwardIcon className="w-5 h-5" />
              </Button>
            </div>
            <div>
              <Slider
                label="Speed"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>
        <Card title="Metrics">
          {stepData && (
            <div className="font-mono text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Step:</span>
                <span className="text-text-primary">{currentStep} / {simulation!.steps.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Comparisons:</span>
                <span className="text-text-primary">{stepData.metrics.comparisons}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MergeSortSimulator;