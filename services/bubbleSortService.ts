
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getBubbleSortSimulation = (inputArray: number[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let arr = [...inputArray];
  let n = arr.length;
  let comparisons = 0;
  let swaps = 0;
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
      metrics: { comparisons, swaps },
      educational_notes
    });
  };

  createStep("Initial state of the array.", { array: [] }, []);

  for (let i = 0; i < n - 1; i++) {
    const currentlySorted = Array.from({ length: i }, (_, k) => n - 1 - k);
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      createStep(`Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]}).`, { comparing: [j, j + 1] }, currentlySorted, [`Bubble Sort works by repeatedly swapping adjacent elements if they are in the wrong order.`]);
      
      if (arr[j] > arr[j + 1]) {
        swaps++;
        swappedInPass = true;
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        createStep(`Swapping ${arr[j+1]} and ${arr[j]}.`, { swapping: [j, j + 1] }, currentlySorted, [`Since ${arr[j+1]} > ${arr[j]}, they are swapped to move the larger element to the right.`]);
      }
    }
    
    if (!swappedInPass) {
        createStep("Array is sorted. No swaps in the last pass.", { array: [] }, Array.from({length: n}, (_, k) => k), ["An optimization: if a full pass completes with no swaps, the array is sorted, and we can stop early."]);
        break;
    }
  }

  const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
  createStep("Final sorted array.", { array: [] }, finalSortedIndices, ["The largest elements have 'bubbled' up to their correct positions."]);
  
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
