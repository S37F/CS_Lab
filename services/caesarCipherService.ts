
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getCaesarCipherSimulation = (plaintext: string, shift: number, encrypt: boolean): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  let outputText = '';

  const createStep = (description: string, currentIndex: number, currentOutput: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        plaintext: plaintext,
        ciphertext: currentOutput,
        shift: shift,
        currentIndex,
      },
      metrics: {},
      educational_notes: [],
    });
  };

  const effectiveShift = encrypt ? shift : -shift;
  
  createStep(`Starting ${encrypt ? 'encryption' : 'decryption'} with a shift of ${shift}.`, -1, '');

  for (let i = 0; i < plaintext.length; i++) {
    let char = plaintext[i];
    let transformedChar = char;

    if (/[a-zA-Z]/.test(char)) {
      const isUpperCase = char === char.toUpperCase();
      const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
      const originalCharCode = char.charCodeAt(0);
      
      let shiftedCode = originalCharCode - base + effectiveShift;
      shiftedCode = (shiftedCode % 26 + 26) % 26; // Handles positive and negative shifts
      
      transformedChar = String.fromCharCode(base + shiftedCode);
      
      createStep(`Processing character '${char}'. Shifting by ${effectiveShift}. Result: '${transformedChar}'.`, i, outputText + transformedChar);
    } else {
      createStep(`Character '${char}' is not a letter, skipping shift.`, i, outputText + transformedChar);
    }
    outputText += transformedChar;
  }

  createStep(`Process complete. Final output: "${outputText}".`, -1, outputText);

  const endTime = performance.now();

  return {
    success: true,
    result: { output: outputText },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.05, // Mock value
      complexity: {
        time: "O(n)",
        space: "O(n)"
      }
    }
  };
};
