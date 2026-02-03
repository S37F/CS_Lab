
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getSelectionSortSimulation = (inputArray: number[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let arr = [...inputArray];
  let n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let stepCounter = 0;

  const createStep = (description: string, highlights: Record<string, number[]>, sortedUntilIndex: number) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        array: [...arr],
        highlights,
        sortedUntilIndex,
      },
      metrics: { comparisons, swaps },
      educational_notes: [],
    });
  };

  createStep("Initial state of the array.", {}, 0);

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    createStep(`Pass ${i + 1}: Find minimum in unsorted part. Current min is ${arr[minIndex]}.`, { min: [minIndex] }, i);

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      createStep(`Comparing ${arr[j]} with current minimum ${arr[minIndex]}.`, { comparing: [j], min: [minIndex] }, i);
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        createStep(`Found new minimum: ${arr[minIndex]}.`, { min: [minIndex] }, i);
      }
    }

    if (minIndex !== i) {
      swaps++;
      createStep(`Swapping minimum ${arr[minIndex]} with first unsorted element ${arr[i]}.`, { swapping: [i, minIndex] }, i);
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      createStep(`Array after swap.`, { swapping: [i, minIndex] }, i + 1);
    } else {
        createStep(`Element ${arr[i]} is already in correct position. No swap needed.`, {}, i + 1);
    }
  }

  createStep("Final sorted array.", {}, n);
  
  const endTime = performance.now();

  return {
    success: true,
    result: { output: arr },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: {
        time: "O(n^2)",
        space: "O(1)"
      }
    }
  };
};
