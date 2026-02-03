
import type { AlgorithmSimulation, AlgorithmStep, Process } from '../types';

export const getFcfsSchedulingSimulation = (processes: Process[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  
  const colors = ['bg-accent-primary', 'bg-accent-success', 'bg-accent-warning', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
  let simProcesses = processes
    .map((p, i) => ({ ...p, id: `P${i}`, color: colors[i % colors.length] }))
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
          averageWaitingTime: count > 0 ? totalWaitingTime / count : 0,
          averageTurnaroundTime: count > 0 ? totalTurnaroundTime / count : 0,
      };
  };

  const createStep = (description: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        processes: JSON.parse(JSON.stringify(simProcesses)),
        readyQueue: readyQueue.map(p => p.id),
        ganttChart: [...ganttChart],
        currentTime,
        completedProcesses: completedProcesses.length,
      },
      metrics: updateMetrics(),
      educational_notes: [],
    });
  };
  
  createStep("Initial state. Processes are sorted by arrival time.");

  while (simProcesses.length > 0 || readyQueue.length > 0) {
    // Add processes that have arrived to the ready queue
    while (simProcesses.length > 0 && simProcesses[0].arrivalTime <= currentTime) {
        const arrivedProcess = simProcesses.shift()!;
        readyQueue.push(arrivedProcess);
        createStep(`Time ${currentTime}: Process ${arrivedProcess.id} has arrived and is added to the ready queue.`);
    }

    if (readyQueue.length > 0) {
      const currentProcess = readyQueue.shift()!;
      createStep(`Time ${currentTime}: Process ${currentProcess.id} is selected from the ready queue for execution.`);
      
      const executionStartTime = currentTime;
      const executionEndTime = currentTime + currentProcess.burstTime;

      currentProcess.completionTime = executionEndTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;

      ganttChart.push({
        processId: currentProcess.id,
        start: executionStartTime,
        end: executionEndTime,
        color: currentProcess.color!,
      });
      
      currentTime = executionEndTime;
      completedProcesses.push(currentProcess);
      
      createStep(`Time ${currentTime}: Process ${currentProcess.id} finishes execution.`);

    } else {
      // If no process is ready, advance time to the next arrival
      if (simProcesses.length > 0) {
        const nextArrivalTime = simProcesses[0].arrivalTime;
        if(currentTime < nextArrivalTime) {
            createStep(`Time ${currentTime}: CPU is idle. Advancing time to next arrival.`);
            currentTime = nextArrivalTime;
        }
      }
    }
  }

  createStep("All processes have completed execution.");
  
  const endTime = performance.now();

  return {
    success: true,
    result: {
      output: completedProcesses,
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1, // Mock value
      complexity: {
        time: "O(n log n)",
        space: "O(n)"
      }
    }
  };
};
