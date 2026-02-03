
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getLzwSimulation = (input: string): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  let dictionary: { [key: string]: number } = {};
  let dictSize = 256; // Assuming ASCII
  for (let i = 0; i < dictSize; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }
  
  const createStep = (w: string, k: string, found: boolean, output: number | string, newEntry: string | null) => {
    steps.push({
      id: stepCounter++,
      description: "",
      state: {
        dictionary: { ...dictionary },
        w, k, found, output, newEntry
      },
      metrics: {},
      educational_notes: [],
    });
  };

  let w = "";
  const result: number[] = [];
  
  createStep("", "", false, "", null);

  for (let i = 0; i < input.length; i++) {
    const k = input[i];
    const wk = w + k;

    if (dictionary.hasOwnProperty(wk)) {
      createStep(w, k, true, "", null);
      w = wk;
    } else {
      const outputCode = dictionary[w];
      result.push(outputCode);
      const newEntryString = `${dictSize}: ${wk}`;
      createStep(w, k, false, outputCode, newEntryString);
      dictionary[wk] = dictSize++;
      w = k;
    }
  }

  if (w !== "") {
    const finalCode = dictionary[w];
    result.push(finalCode);
    createStep(w, "[EOF]", false, finalCode, null);
  }

  const endTime = performance.now();

  return {
    success: true,
    result: { output: result },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(n)', space: 'O(d)' }
    }
  };
};
