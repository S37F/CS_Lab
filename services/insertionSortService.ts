
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getInsertionSortSimulation = (inputArray: number[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let arr = [...inputArray];
  let n = arr.length;
  let comparisons = 0;
  let shifts = 0;
  let stepCounter = 0;

  const createStep = (description: string, highlights: Record<string, number[]>, sortedIndices: number[], educational_notes: string[] = []) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        array: [...arr],
        highlights,
        sortedIndices: [...sortedIndices],
      },
      metrics: { comparisons, swaps: shifts }, // Using 'swaps' field for shifts
      educational_notes
    });
  };

  createStep("Initial state. The first element is considered sorted.", { array: [] }, [0]);

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    const sortedPart = Array.from({ length: i }, (_, k) => k);
    
    createStep(`Select ${key} as the key to be inserted into the sorted part.`, { key: [i] }, sortedPart, ["Insertion sort builds the sorted array one element at a time."]);

    while (j >= 0 && arr[j] > key) {
      comparisons++;
      createStep(`Comparing key ${key} with ${arr[j]}.`, { key: [i], comparing: [j] }, sortedPart, [`The key (${key}) is smaller than the element in the sorted part (${arr[j]}).`]);
      
      arr[j + 1] = arr[j];
      shifts++;
      createStep(`Shift ${arr[j]} to the right.`, { shifting: [j, j + 1] }, sortedPart, ["Elements in the sorted part are shifted right to make space for the key."]);
      j = j - 1;
    }
    
    if (j >= 0) {
      comparisons++; // Final comparison that fails the while loop condition
      createStep(`Comparing key ${key} with ${arr[j]}. Condition fails.`, { key: [i], comparing: [j] }, sortedPart, [`The key (${key}) is not smaller than ${arr[j]}, so we found the correct position.`]);
    }

    arr[j + 1] = key;
    const newSortedPart = Array.from({ length: i + 1 }, (_, k) => k);
    createStep(`Insert key ${key} at index ${j + 1}.`, { inserting: [j + 1] }, newSortedPart, ["The key is placed in its correct sorted position."]);
  }

  createStep("Final sorted array.", { array: [] }, Array.from({ length: n }, (_, k) => k));

  const endTime = performance.now();

  return {
    success: true,
    result: {
      output: arr,
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1, // Mock value
      complexity: {
        time: "O(n^2)",
        space: "O(1)"
      }
    }
  };
};
