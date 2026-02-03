
import type { AlgorithmSimulation, AlgorithmStep, DiskRequest } from '../types';

export const getFcfsDiskSimulation = (requests: number[], startPos: number, maxCylinder: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const requestQueue: DiskRequest[] = requests.map((r, i) => ({ id: i, cylinder: r }));
  let headPosition = startPos;
  let totalMovement = 0;
  let servicedRequests: number[] = [];

  const createStep = (description: string, currentRequest: DiskRequest | null) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        headPosition,
        requests: requestQueue,
        serviced: [...servicedRequests],
        currentRequest,
      },
      metrics: { totalMovement },
      educational_notes: [],
    });
  };

  createStep("Initial state. Head at cylinder " + startPos, null);

  for (const req of requestQueue) {
    const movement = Math.abs(req.cylinder - headPosition);
    totalMovement += movement;
    
    createStep(`Servicing request at cylinder ${req.cylinder}.`, req);
    
    headPosition = req.cylinder;
    servicedRequests.push(req.id);

    createStep(`Head moves to ${req.cylinder}. Movement: ${movement}.`, null);
  }

  createStep("All requests serviced.", null);

  const endTime = performance.now();

  return {
    success: true,
    result: { totalMovement },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: { time: 'O(N)', space: 'O(N)' }
    }
  };
};
