
import type { AlgorithmSimulation, AlgorithmStep, Process } from '../types';

export const getSjfSchedulingSimulation = (processes: Process[], preemptive: boolean): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  
  const colors = ['bg-accent-primary', 'bg-accent-success', 'bg-accent-warning', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  let simProcesses = processes
    .map((p, i) => ({ ...p, id: `P${i}`, color: colors[i % colors.length], remainingTime: p.burstTime }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let completedProcesses: Process[] = [];
  let readyQueue: Process[] = [];
  let ganttChart: { processId: string; start: number; end: number; color: string }[] = [];
  
  const updateMetrics = () => {
      const totalWaitingTime = completedProcesses.reduce((acc, p) => acc + p.waitingTime!, 0);
      const totalTurnaroundTime = completedProcesses.reduce((acc, p) => acc + p.turnaroundTime!, 0);
      const count = completedProcesses.length;
      return {
          averageWaitingTime: count > 0 ? (totalWaitingTime / count) : 0,
          averageTurnaroundTime: count > 0 ? (totalTurnaroundTime / count) : 0,
      };
  };

  const createStep = (description: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        ganttChart: [...ganttChart],
        currentTime,
        readyQueue: readyQueue.map(p => p.id),
        completedCount: completedProcesses.length
      },
      metrics: updateMetrics(),
      educational_notes: [],
    });
  };
  
  createStep("Initial state. Processes sorted by arrival time.");
  let remainingProcesses = [...simProcesses];

  while (remainingProcesses.length > 0 || readyQueue.length > 0) {
    // Add arrived processes to ready queue
    while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
        const arrivedProcess = remainingProcesses.shift()!;
        readyQueue.push(arrivedProcess);
        createStep(`Time ${currentTime}: Process ${arrivedProcess.id} arrived.`);
    }

    if (readyQueue.length === 0) {
        if(remainingProcesses.length > 0) {
             createStep(`Time ${currentTime}: CPU is idle.`);
             currentTime = remainingProcesses[0].arrivalTime;
        }
        continue;
    }

    readyQueue.sort((a, b) => a.remainingTime! - b.remainingTime!);
    const currentProcess = readyQueue.shift()!;

    createStep(`Time ${currentTime}: Process ${currentProcess.id} selected (Remaining: ${currentProcess.remainingTime}).`);
    
    let executeUntil = Infinity;
    if (preemptive) {
        // Find next process arrival time to check for preemption
        if (remainingProcesses.length > 0) {
            executeUntil = remainingProcesses[0].arrivalTime;
        }
    }

    const executionTime = Math.min(currentProcess.remainingTime!, executeUntil - currentTime);
    
    if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === currentProcess.id) {
        ganttChart[ganttChart.length - 1].end += executionTime;
    } else {
        ganttChart.push({ processId: currentProcess.id, start: currentTime, end: currentTime + executionTime, color: currentProcess.color! });
    }

    currentProcess.remainingTime! -= executionTime;
    currentTime += executionTime;

    if (currentProcess.remainingTime! <= 0) {
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        completedProcesses.push(currentProcess);
        createStep(`Time ${currentTime}: Process ${currentProcess.id} finished.`);
    } else {
        readyQueue.push(currentProcess); // Add back to ready queue if preempted
         createStep(`Time ${currentTime}: Process ${currentProcess.id} preempted.`);
    }
  }

  createStep("All processes have completed execution.");
  
  const endTime = performance.now();

  return {
    success: true,
    result: { output: completedProcesses },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1, 
      complexity: { time: "O(n^2)", space: "O(n)" }
    }
  };
};
