
import type { AlgorithmSimulation, AlgorithmStep, DiskRequest } from '../types';

export const getScanDiskSimulation = (requests: number[], startPos: number, maxCylinder: number, initialDirection: 'up' | 'down'): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const initialRequests: DiskRequest[] = requests.map((r, i) => ({ id: i, cylinder: r }));
  let requestQueue = [...requests].sort((a,b) => a-b);
  
  let headPosition = startPos;
  let totalMovement = 0;
  let servicedRequests: number[] = [];
  let direction = initialDirection;

  const createStep = (description: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        headPosition,
        initialRequests,
        serviced: [...servicedRequests],
        direction,
      },
      metrics: { totalMovement },
      educational_notes: [],
    });
  };

  createStep(`Initial state. Head at ${startPos}, direction: ${direction}.`);
  
  while (requestQueue.length > 0) {
    let nextRequests: number[];
    if (direction === 'up') {
        nextRequests = requestQueue.filter(r => r >= headPosition);
    } else { // 'down'
        nextRequests = requestQueue.filter(r => r <= headPosition).reverse();
    }

    if (nextRequests.length === 0) {
        direction = direction === 'up' ? 'down' : 'up';
        const endPoint = direction === 'down' ? maxCylinder - 1 : 0;
        totalMovement += Math.abs(endPoint - headPosition);
        headPosition = endPoint;
        createStep(`No requests in current direction. Moving to end at ${headPosition}.`);
        continue;
    }
    
    for (const req of nextRequests) {
        totalMovement += Math.abs(req - headPosition);
        headPosition = req;
        servicedRequests.push(req);
        requestQueue = requestQueue.filter(r => r !== req);
        createStep(`Serviced request at cylinder ${headPosition}.`);
    }
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
