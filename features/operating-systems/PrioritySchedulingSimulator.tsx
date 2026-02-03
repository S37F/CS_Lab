import React, { useState, useEffect, useCallback } from 'react';
import { getPrioritySchedulingSimulation } from '../../services/prioritySchedulingService';
import type { AlgorithmSimulation, AlgorithmStep, Process } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const PrioritySchedulingSimulator: React.FC = () => {
  const [processes, setProcesses] = useState<Partial<Process>[]>([
    { id: 'P0', arrivalTime: 0, burstTime: 8, priority: 3 },
    { id: 'P1', arrivalTime: 1, burstTime: 4, priority: 1 }, // Higher priority
    { id: 'P2', arrivalTime: 2, burstTime: 9, priority: 4 },
    { id: 'P3', arrivalTime: 3, burstTime: 5, priority: 2 },
  ]);
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const speed = 500;

  const runSimulation = useCallback(() => {
    const validProcesses = processes
      .filter(p => p.arrivalTime != null && p.burstTime != null && p.priority != null && p.burstTime > 0) as Process[];
    
    if (validProcesses.length > 0) {
      const simData = getPrioritySchedulingSimulation(validProcesses, isPreemptive);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [processes, isPreemptive]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleProcessChange = (index: number, field: keyof Process, value: string) => {
    const newProcesses = [...processes];
    const numValue = parseInt(value, 10);
    newProcesses[index] = { ...newProcesses[index], [field]: isNaN(numValue) ? undefined : numValue };
    setProcesses(newProcesses);
  };
  
  const addProcess = () => setProcesses([...processes, { id: `P${processes.length}`, priority: 1 }]);
  const removeProcess = (index: number) => setProcesses(processes.filter((_, i) => i !== index));

  const handleReset = () => runSimulation();
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
  }, isPlaying ? speed : null);

  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;
  const totalTime = stepData?.state.ganttChart.reduce((max: number, entry: any) => Math.max(max, entry.end), 10) || 10;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card title={`Gantt Chart - ${isPreemptive ? 'Preemptive' : 'Non-Preemptive'}`}>
          <div className="p-4 space-y-4">
            <div className="w-full h-16 bg-background-elevated rounded-md relative border border-border">
              {stepData?.state.ganttChart.map((entry: any, index: number) => (
                <div key={index}
                  className={`absolute h-full flex items-center justify-center text-white font-bold text-xs rounded-sm ${entry.color}`}
                  style={{
                    left: `${(entry.start / totalTime) * 100}%`,
                    width: `${((entry.end - entry.start) / totalTime) * 100}%`,
                  }}
                >
                  {entry.processId}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-between text-xs text-text-tertiary">
              {[...Array(11)].map((_, i) => <span key={i}>{Math.round(totalTime * i / 10)}</span>)}
            </div>
            <div className="p-4 border-t border-border mt-4">
              <p className="text-sm text-center font-mono text-text-secondary h-5">
                {stepData?.description}
              </p>
            </div>
             <div className="flex items-center justify-center pt-2 space-x-4">
              <Button onClick={handleReset} variant="ghost" size="lg"><RefreshIcon className="w-5 h-5"/></Button>
              <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
              </Button>
              <Button onClick={handleStepForward} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                <StepForwardIcon className="w-5 h-5"/>
              </Button>
            </div>
          </div>
        </Card>
         <Card title="Metrics" className="mt-6">
            <div className="font-mono text-sm grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                    <span className="text-text-tertiary">Avg. Waiting Time:</span>
                    <span className="text-text-primary">{stepData?.metrics.averageWaitingTime.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-text-tertiary">Avg. Turnaround Time:</span>
                    <span className="text-text-primary">{stepData?.metrics.averageTurnaroundTime.toFixed(2)}</span>
                </div>
            </div>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card title="Process Input (Lower number = higher priority)">
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-text-tertiary">
              <span>ID</span>
              <span>Arrival</span>
              <span>Burst</span>
              <span>Priority</span>
            </div>
            {processes.map((p, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <Input className="font-mono" value={p.id} readOnly />
                <Input type="number" min="0" className="font-mono" value={p.arrivalTime ?? ''} onChange={(e) => handleProcessChange(i, 'arrivalTime', e.target.value)} />
                <Input type="number" min="1" className="font-mono" value={p.burstTime ?? ''} onChange={(e) => handleProcessChange(i, 'burstTime', e.target.value)} />
                <Input type="number" min="1" className="font-mono" value={p.priority ?? ''} onChange={(e) => handleProcessChange(i, 'priority', e.target.value)} />
                <button onClick={() => removeProcess(i)} className="text-red-500 hover:text-red-400">✕</button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addProcess} variant="secondary" className="w-full">Add Process</Button>
          </div>
           <div className="mt-4 space-y-2">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={isPreemptive} onChange={() => setIsPreemptive(!isPreemptive)} />
                        <div className="block bg-border w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPreemptive ? 'transform translate-x-full bg-accent-primary' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-text-secondary font-medium">Preemptive</div>
                </label>
            </div>
            <Button onClick={runSimulation} className="w-full mt-2">Run Simulation</Button>
        </Card>
      </div>
    </div>
  );
};

export default PrioritySchedulingSimulator;