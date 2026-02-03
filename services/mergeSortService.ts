
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getMergeSortSimulation = (inputArray: number[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  let comparisons = 0;

  const createStep = (description: string, array: number[], highlights: Record<string, number[]>, subarrays: any[] = [], educational_notes: string[] = []) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        array: [...array],
        highlights,
        subarrays,
      },
      metrics: { comparisons, swaps: 0 },
      educational_notes,
    });
  };

  createStep("Initial state of the array.", [...inputArray], {}, []);

  function merge(arr: number[], l: number, m: number, r: number) {
    const n1 = m - l + 1;
    const n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0;
    let j = 0;
    let k = l;
    
    const initialSubarrays = [
        { name: 'Left', arr: [...L], range: [l, m] },
        { name: 'Right', arr: [...R], range: [m+1, r] },
    ];
    createStep(`Merging subarrays [${L.join(', ')}] and [${R.join(', ')}].`, [...arr], { merging: [l, r] }, initialSubarrays, ["The core of Merge Sort: efficiently merging two sorted subarrays."]);

    while (i < n1 && j < n2) {
      comparisons++;
      createStep(`Comparing ${L[i]} and ${R[j]}.`, [...arr], { comparing: [l+i, m+1+j] }, initialSubarrays);
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      createStep(`Placing ${arr[k]} into the main array at index ${k}.`, [...arr], { placed: [k] }, initialSubarrays);
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      createStep(`Copying remaining element ${L[i]} from left subarray.`, [...arr], { placed: [k] }, initialSubarrays);
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      createStep(`Copying remaining element ${R[j]} from right subarray.`, [...arr], { placed: [k] }, initialSubarrays);
      j++;
      k++;
    }
  }

  function mergeSort(arr: number[], l: number, r: number) {
    if (l >= r) {
      createStep(`Base case: Subarray of size 1 at index ${l} is already sorted.`, [...arr], { sorted: [l] });
      return;
    }
    const m = l + Math.floor((r - l) / 2);
    createStep(`Splitting array. Processing left part from index ${l} to ${m}.`, [...arr], { splitting: [l, m] }, [], ["Divide: The array is recursively split into two halves."]);
    mergeSort(arr, l, m);
    createStep(`Left part sorted. Processing right part from index ${m + 1} to ${r}.`, [...arr], { splitting: [m + 1, r] });
    mergeSort(arr, m + 1, r);
    createStep(`Both halves are sorted. Merging them.`, [...arr], { merging: [l, r] }, [], ["Conquer: Sorted subarrays are merged back together."]);
    merge(arr, l, m, r);
  }

  let arr = [...inputArray];
  mergeSort(arr, 0, arr.length - 1);
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
      memory_usage_mb: 0.2, // Mock value
      complexity: {
        time: "O(n log n)",
        space: "O(n)"
      }
    }
  };
};
