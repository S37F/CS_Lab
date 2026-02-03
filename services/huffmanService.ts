
import type { AlgorithmSimulation, AlgorithmStep, HuffmanNode } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Simple uuid for unique keys

// A simple Priority Queue implementation for Huffman nodes
class PriorityQueue {
    private nodes: HuffmanNode[] = [];
    enqueue(node: HuffmanNode) {
        this.nodes.push(node);
        this.nodes.sort((a, b) => a.freq - b.freq);
    }
    dequeue() { return this.nodes.shift(); }
    size() { return this.nodes.length; }
}

export const getHuffmanSimulation = (text: string): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const createStep = (description: string, tree: HuffmanNode | null, frequencies: any, codes: any = null) => {
    steps.push({
      id: stepCounter++,
      description,
      state: { tree: tree ? JSON.parse(JSON.stringify(tree)) : null, frequencies, codes },
      metrics: {},
      educational_notes: [],
    });
  };

  // 1. Calculate frequencies
  const frequencies: { [key: string]: number } = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  createStep("Calculated character frequencies.", null, frequencies);

  // 2. Create leaf nodes and enqueue
  const pq = new PriorityQueue();
  for (const char in frequencies) {
    pq.enqueue({ char, freq: frequencies[char], id: uuidv4() });
  }

  // 3. Build the tree
  while (pq.size() > 1) {
    const left = pq.dequeue()!;
    const right = pq.dequeue()!;
    const newNode: HuffmanNode = {
      char: '',
      freq: left.freq + right.freq,
      left,
      right,
      id: uuidv4(),
    };
    createStep(`Merging nodes '${left.char || left.freq}' and '${right.char || right.freq}'.`, newNode, frequencies);
    pq.enqueue(newNode);
  }

  const root = pq.dequeue()!;
  createStep("Huffman tree construction complete.", root, frequencies);

  // 4. Generate codes
  const codes: { [key: string]: string } = {};
  function generateCodes(node: HuffmanNode, path: string) {
    if (!node.left && !node.right) { // Leaf node
      codes[node.char] = path || '0'; // Handle single-node tree
      return;
    }
    if(node.left) generateCodes(node.left, path + '0');
    if(node.right) generateCodes(node.right, path + '1');
  }
  generateCodes(root, '');
  createStep("Generated final prefix codes.", root, frequencies, codes);

  const endTime = performance.now();

  return {
    success: true,
    result: { codes },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: { time: 'O(n log n)', space: 'O(n)' }
    }
  };
};

// Dummy uuid for environments without crypto
const v4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
