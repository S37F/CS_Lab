
import type { AlgorithmSimulation, AlgorithmStep, Process } from '../types';

export const getPrioritySchedulingSimulation = (processes: Process[], preemptive: boolean): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  
  const colors = ['bg-accent-primary', 'bg-accent-success', 'bg-accent-warning', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  const simProcesses = processes
    .map((p, i) => ({ ...p, id: `P${i}`, color: colors[i % colors.length], remainingTime: p.burstTime }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const numProcesses = simProcesses.length;
  let currentTime = 0;
  let completedProcesses: Process[] = [];
  let readyQueue: (typeof simProcesses[0])[] = [];
  let ganttChart: { processId: string; start: number; end: number; color: string }[] = [];
  let remainingProcesses = [...simProcesses];
  let runningProcess: (typeof simProcesses[0]) | null = null;
  
  const updateMetrics = () => {
      const totalWaitingTime = completedProcesses.reduce((acc, p) => acc + (p.waitingTime ?? 0), 0);
      const totalTurnaroundTime = completedProcesses.reduce((acc, p) => acc + (p.turnaroundTime ?? 0), 0);
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
      state: { ganttChart: [...ganttChart], currentTime },
      metrics: updateMetrics(),
      educational_notes: [],
    });
  };
  
  createStep("Initial state.");
  
  while (completedProcesses.length < numProcesses) {
    // Add processes that have arrived to the ready queue
    while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
      const arrivedProcess = remainingProcesses.shift()!;
      readyQueue.push(arrivedProcess);
    }

    // Sort ready queue by priority (lower number is higher priority)
    readyQueue.sort((a, b) => a.priority! - b.priority!);

    const currentHighestPriority = readyQueue.length > 0 ? readyQueue[0] : null;

    if (preemptive && runningProcess && currentHighestPriority && currentHighestPriority.priority! < runningProcess.priority!) {
        // Preempt current process
        readyQueue.push(runningProcess);
        runningProcess = null;
    }

    if (!runningProcess && readyQueue.length > 0) {
      runningProcess = readyQueue.shift()!;
      createStep(`Time ${currentTime}: Process ${runningProcess.id} selected (Priority: ${runningProcess.priority}).`);
    } else if (!runningProcess) {
      createStep(`Time ${currentTime}: CPU is idle.`);
      currentTime = remainingProcesses[0]?.arrivalTime ?? (currentTime + 1);
      continue;
    }
    
    const executionStartTime = currentTime;
    currentTime++;
    runningProcess.remainingTime!--;
    
    // Update Gantt chart
    if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === runningProcess.id) {
        ganttChart[ganttChart.length-1].end = currentTime;
    } else {
        ganttChart.push({ processId: runningProcess.id, start: executionStartTime, end: currentTime, color: runningProcess.color! });
    }

    if (runningProcess.remainingTime! <= 0) {
      runningProcess.completionTime = currentTime;
      runningProcess.turnaroundTime = runningProcess.completionTime - runningProcess.arrivalTime;
      runningProcess.waitingTime = runningProcess.turnaroundTime - runningProcess.burstTime;
      completedProcesses.push(runningProcess as Process);
      createStep(`Time ${currentTime}: Process ${runningProcess.id} finished.`);
      runningProcess = null;
    } else if (!preemptive) {
        // Non-preemptive: let it run until it finishes
        const remainingExecution = runningProcess.remainingTime;
        runningProcess.remainingTime = 0;
        currentTime += remainingExecution;
        ganttChart[ganttChart.length-1].end = currentTime;

        runningProcess.completionTime = currentTime;
        runningProcess.turnaroundTime = runningProcess.completionTime - runningProcess.arrivalTime;
        runningProcess.waitingTime = runningProcess.turnaroundTime - runningProcess.burstTime;
        completedProcesses.push(runningProcess as Process);
        createStep(`Time ${currentTime}: Process ${runningProcess.id} finished.`);
        runningProcess = null;
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
