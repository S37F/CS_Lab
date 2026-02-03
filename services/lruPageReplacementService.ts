
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getLruSimulation = (pages: string[], frameCount: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  let frames: (string | null)[] = Array(frameCount).fill(null);
  let lruStack: string[] = []; // Stack to track recency. 0 is LRU, end is MRU.
  let faults = 0;
  let hits = 0;

  const createStep = (description: string, pageIndex: number, lastEvent?: {type: 'hit' | 'fault', page: string, replaced?: string}) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        frames: [...frames],
        lruStack: [...lruStack],
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
    // Check for hit
    if (frames.includes(page)) {
      hits++;
      // Move page to the top (most recently used) of the stack
      lruStack = lruStack.filter(p => p !== page);
      lruStack.push(page);
      createStep(`Page ${page} is already in memory. (Page Hit)`, index, {type: 'hit', page});
    } else {
      // Page Fault
      faults++;
      let replacedPage: string | undefined = undefined;

      if (frames.includes(null)) {
        // There is an empty frame
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        lruStack.push(page);
        createStep(`Page ${page} not in memory. Loading into empty frame. (Page Fault)`, index, {type: 'fault', page});
      } else {
        // No empty frames, replace the least recently used page
        const pageToReplace = lruStack.shift()!;
        replacedPage = pageToReplace;
        const replaceIndex = frames.indexOf(pageToReplace);
        frames[replaceIndex] = page;
        lruStack.push(page);
        createStep(`Page ${page} not in memory. Replacing LRU page ${pageToReplace}. (Page Fault)`, index, {type: 'fault', page, replaced: replacedPage});
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
      complexity: { time: 'O(n*f)', space: 'O(f)' }
    }
  };
};
