
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getQuickSortSimulation = (inputArray: number[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  let comparisons = 0;
  let swaps = 0;

  const createStep = (description: string, array: number[], highlights: Record<string, number[]>, educational_notes: string[] = []) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        array: [...array],
        highlights,
      },
      metrics: { comparisons, swaps },
      educational_notes,
    });
  };

  function swap(arr: number[], i: number, j: number) {
    swaps++;
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  function partition(arr: number[], low: number, high: number) {
    const pivot = arr[high];
    createStep(`Choosing ${pivot} as the pivot. Partitioning from index ${low} to ${high}.`, arr, { pivot: [high], range: Array.from({length: high - low + 1}, (_, i) => low + i) }, ["Quick Sort works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays."]);
    
    let i = low - 1; 

    for (let j = low; j < high; j++) {
      comparisons++;
      createStep(`Comparing ${arr[j]} with pivot ${pivot}.`, arr, { pivot: [high], comparing: [j], i: i >= low ? [i] : [], range: Array.from({length: high - low + 1}, (_, i) => low + i) });
      if (arr[j] < pivot) {
        i++;
        createStep(`${arr[j]} < ${pivot}. Incrementing 'i' to ${i} and swapping arr[i] with arr[j].`, arr, { pivot: [high], swapping: [i, j], i: [i], range: Array.from({length: high - low + 1}, (_, i) => low + i) });
        swap(arr, i, j);
        createStep(`Array after swapping.`, arr, { pivot: [high], swapping: [i, j], i: [i], range: Array.from({length: high - low + 1}, (_, i) => low + i) });
      }
    }
    createStep(`Partitioning complete. Swapping pivot ${arr[high]} with element at index ${i + 1}.`, arr, { pivot: [high], swapping: [i + 1, high], i: i >= low ? [i] : [], range: Array.from({length: high - low + 1}, (_, i) => low + i) });
    swap(arr, i + 1, high);
    createStep(`Pivot ${arr[i+1]} is now in its final sorted position.`, arr, { sorted: [i + 1] });
    return i + 1;
  }

  function quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pi = partition(arr, low, high);
      createStep(`Recursively sorting left sub-array from index ${low} to ${pi - 1}.`, arr, { range: Array.from({length: pi - low}, (_, i) => low + i) });
      quickSort(arr, low, pi - 1);
      createStep(`Recursively sorting right sub-array from index ${pi + 1} to ${high}.`, arr, { range: Array.from({length: high - pi}, (_, i) => pi + 1 + i) });
      quickSort(arr, pi + 1, high);
    } else if (low <= high && low < arr.length) {
       createStep(`Sub-array from index ${low} to ${high} is sorted (base case).`, arr, { sorted: Array.from({length: high-low+1}, (_, i) => low+i) });
    }
  }

  let arr = [...inputArray];
  createStep("Initial state of the array.", arr, {});
  quickSort(arr, 0, arr.length - 1);
  createStep("Final sorted array.", arr, { sorted: arr.map((_, i) => i) });

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
        time: "O(n log n)",
        space: "O(log n)"
      }
    }
  };
};
