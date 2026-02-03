
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getFifoSimulation = (pages: string[], frameCount: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  let frames: (string | null)[] = Array(frameCount).fill(null);
  let frameQueue: string[] = [];
  let faults = 0;
  let hits = 0;

  const createStep = (description: string, pageIndex: number, lastEvent?: {type: 'hit' | 'fault', page: string}) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        frames: [...frames],
        pages: [...pages],
        pageIndex,
        lastEvent
      },
      metrics: { faults, hits },
      educational_notes: [],
    });
  };

  createStep("Initial state with empty frames.", -1);

  pages.forEach((page, index) => {
    if (frames.includes(page)) {
      // Page Hit
      hits++;
      createStep(`Page ${page} is already in memory. (Page Hit)`, index, {type: 'hit', page});
    } else {
      // Page Fault
      faults++;
      if (frames.includes(null)) {
        // There is an empty frame
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        frameQueue.push(page);
        createStep(`Page ${page} not in memory. Loading into empty frame. (Page Fault)`, index, {type: 'fault', page});
      } else {
        // No empty frames, replace the oldest page
        const pageToReplace = frameQueue.shift()!;
        const replaceIndex = frames.indexOf(pageToReplace);
        frames[replaceIndex] = page;
        frameQueue.push(page);
        createStep(`Page ${page} not in memory. Replacing oldest page ${pageToReplace}. (Page Fault)`, index, {type: 'fault', page});
      }
    }
  });
  
  createStep("All page references processed.", pages.length);

  const endTime = performance.now();

  return {
    success: true,
    result: { faults, hits },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: { time: 'O(n)', space: 'O(f)' }
    }
  };
};
