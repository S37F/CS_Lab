
import type { AlgorithmSimulation, AlgorithmStep, DiskRequest } from '../types';

export const getSstfDiskSimulation = (requests: number[], startPos: number, maxCylinder: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const initialRequests: DiskRequest[] = requests.map((r, i) => ({ id: i, cylinder: r }));
  let requestQueue = [...initialRequests];
  let headPosition = startPos;
  let totalMovement = 0;
  let servicedRequests: number[] = [];

  const createStep = (description: string, currentRequest: DiskRequest | null) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        headPosition,
        initialRequests,
        serviced: [...servicedRequests],
        currentRequest,
      },
      metrics: { totalMovement },
      educational_notes: [],
    });
  };

  createStep("Initial state. Head at cylinder " + startPos, null);

  while (requestQueue.length > 0) {
    let closestReq: DiskRequest | null = null;
    let minDistance = Infinity;

    for (const req of requestQueue) {
      const distance = Math.abs(req.cylinder - headPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestReq = req;
      }
    }
    
    if (closestReq) {
      const movement = minDistance;
      totalMovement += movement;
      
      createStep(`Servicing closest request at cylinder ${closestReq.cylinder}.`, closestReq);
      
      headPosition = closestReq.cylinder;
      servicedRequests.push(closestReq.id);
      requestQueue = requestQueue.filter(r => r.id !== closestReq!.id);

      createStep(`Head moves to ${closestReq.cylinder}. Movement: ${movement}.`, null);
    }
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
      complexity: { time: 'O(N^2)', space: 'O(N)' }
    }
  };
};
