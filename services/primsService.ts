
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../types';

export const getPrimsSimulation = (nodes: GraphNode[], edges: GraphEdge[], startNode: string): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const adj: Record<string, { node: string; weight: number }[]> = {};
  nodes.forEach(node => adj[node.id] = []);
  edges.forEach(edge => {
    adj[edge.source].push({ node: edge.target, weight: edge.weight });
    adj[edge.target].push({ node: edge.source, weight: edge.weight });
  });

  const mstNodes = new Set<string>();
  const mstEdges: GraphEdge[] = [];
  let edgeQueue: GraphEdge[] = [];
  let totalWeight = 0;

  const createStep = (description: string) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        mstNodes: Array.from(mstNodes),
        mstEdges: [...mstEdges],
        edgeQueue: [...edgeQueue].sort((a,b) => a.weight - b.weight),
      },
      metrics: { totalWeight },
      educational_notes: [],
    });
  };

  createStep("Initial state. Start node is " + startNode);
  
  // Start with the startNode
  mstNodes.add(startNode);
  adj[startNode].forEach(neighbor => {
      edgeQueue.push({source: startNode, target: neighbor.node, weight: neighbor.weight});
  });
  createStep(`Added node ${startNode} to MST. Adding its edges to the priority queue.`);

  while (mstNodes.size < nodes.length && edgeQueue.length > 0) {
    // Sort to simulate priority queue
    edgeQueue.sort((a, b) => a.weight - b.weight);
    
    let minEdge: GraphEdge | undefined;
    let edgeIndex = -1;

    // Find the minimum weight edge to a non-MST node
    for(let i = 0; i < edgeQueue.length; i++){
        const edge = edgeQueue[i];
        if(!mstNodes.has(edge.target)){
            minEdge = edge;
            edgeIndex = i;
            break;
        }
    }

    if (!minEdge) break; // No more valid edges

    edgeQueue.splice(edgeIndex, 1);
    
    const newNode = minEdge.target;
    if (mstNodes.has(newNode)) continue; // Skip if it connects to an already included node

    mstNodes.add(newNode);
    mstEdges.push(minEdge);
    totalWeight += minEdge.weight;
    createStep(`Selected edge (${minEdge.source}, ${minEdge.target}) with weight ${minEdge.weight}. Adding ${newNode} to MST.`);

    // Add new edges from the newNode
    adj[newNode].forEach(neighbor => {
        if(!mstNodes.has(neighbor.node)){
             edgeQueue.push({source: newNode, target: neighbor.node, weight: neighbor.weight});
        }
    });
    createStep(`Added edges from ${newNode} to the priority queue.`);
  }

  createStep("MST construction complete.");
  
  const endTime = performance.now();
  return {
    success: true,
    result: { mst: mstEdges, weight: totalWeight },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(E log V)', space: 'O(V + E)' }
    }
  };
};
