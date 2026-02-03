
import type { AlgorithmSimulation, AlgorithmStep, DiskRequest } from '../types';

export const getCscanDiskSimulation = (requests: number[], startPos: number, maxCylinder: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const initialRequests: DiskRequest[] = requests.map((r, i) => ({ id: i, cylinder: r }));
  let requestQueue = [...requests];
  
  let headPosition = startPos;
  let totalMovement = 0;
  let servicedRequests: number[] = [];

  const createStep = (description: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        headPosition,
        initialRequests,
        serviced: [...servicedRequests],
      },
      metrics: { totalMovement },
      educational_notes: [],
    });
  };

  createStep(`Initial state. Head at ${startPos}.`);

  // Requests greater than or equal to start position
  const upRequests = requestQueue.filter(r => r >= headPosition).sort((a,b)=>a-b);
  for (const req of upRequests) {
      totalMovement += Math.abs(req - headPosition);
      headPosition = req;
      servicedRequests.push(req);
      createStep(`Serviced request at cylinder ${headPosition}.`);
  }
  
  // Move to the end of the disk
  if (upRequests.length > 0 || requestQueue.filter(r => r < startPos).length > 0) {
      totalMovement += Math.abs((maxCylinder - 1) - headPosition);
      headPosition = maxCylinder - 1;
      createStep(`Reached end of disk at cylinder ${headPosition}.`);

      // Jump to the beginning
      totalMovement += (maxCylinder - 1);
      headPosition = 0;
      createStep(`Jumping to beginning of disk at cylinder ${headPosition}.`);
  }

  // Requests less than original start position
  const downRequests = requestQueue.filter(r => r < startPos).sort((a,b)=>a-b);
  for (const req of downRequests) {
      totalMovement += Math.abs(req - headPosition);
      headPosition = req;
      servicedRequests.push(req);
      createStep(`Serviced request at cylinder ${headPosition}.`);
  }

  createStep("All requests serviced.");

  const endTime = performance.now();

  return {
    success: true,
    result: { totalMovement },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: { time: 'O(N log N)', space: 'O(N)' }
    }
  };
};
