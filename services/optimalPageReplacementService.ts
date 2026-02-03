
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getOptimalSimulation = (pages: string[], frameCount: number): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  let frames: (string | null)[] = Array(frameCount).fill(null);
  let faults = 0;
  let hits = 0;

  const createStep = (description: string, pageIndex: number, lastEvent?: {type: 'hit' | 'fault', page: string, replaced?: string}) => {
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

  createStep("Initial state.", -1);

  pages.forEach((page, index) => {
    if (frames.includes(page)) {
      hits++;
      createStep(`Page ${page} is already in memory. (Page Hit)`, index, {type: 'hit', page});
    } else {
      faults++;
      let replacedPage: string | undefined = undefined;

      if (frames.includes(null)) {
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        createStep(`Page ${page} loaded into empty frame. (Page Fault)`, index, {type: 'fault', page});
      } else {
        // Find the page to replace
        const futureReferences = pages.slice(index + 1);
        let pageToReplace = '';
        let farthestDistance = -1;

        frames.forEach(framePage => {
            if(framePage === null) return;
            let distance = futureReferences.indexOf(framePage);
            if (distance === -1) { // This page is not used again
                distance = Infinity;
            }
            if (distance > farthestDistance) {
                farthestDistance = distance;
                pageToReplace = framePage;
            }
        });
        
        replacedPage = pageToReplace;
        const replaceIndex = frames.indexOf(pageToReplace);
        frames[replaceIndex] = page;
        createStep(`Replacing page ${pageToReplace} (not used for longest time). (Page Fault)`, index, {type: 'fault', page, replaced: replacedPage});
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
      complexity: { time: 'O(n*f*p)', space: 'O(f)' }
    }
  };
};
