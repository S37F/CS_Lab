
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../types';

export const getBellmanFordSimulation = (nodes: GraphNode[], edges: GraphEdge[], startNode: string): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  
  nodes.forEach(node => {
    distances[node.id] = Infinity;
    predecessors[node.id] = null;
  });
  distances[startNode] = 0;

  const createStep = (description: string, iteration: number, relaxingEdge: GraphEdge | null, updated: boolean, updatedNode: string | null = null, negativeCycle: boolean = false) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        distances: { ...distances },
        iteration,
        relaxingEdge,
        updated,
        updatedNode,
        negativeCycle,
      },
      metrics: {},
      educational_notes: [],
    });
  };

  createStep("Initialization: Distances set to infinity, 0 for the start node.", 0, null, false);
  
  const numVertices = nodes.length;

  for (let i = 1; i < numVertices; i++) {
    let updatedInIteration = false;
    for (const edge of edges) {
      createStep(`Iteration ${i}: Relaxing edge (${edge.source} -> ${edge.target})`, i, edge, false);
      if (distances[edge.source] !== Infinity && distances[edge.source] + edge.weight < distances[edge.target]) {
        distances[edge.target] = distances[edge.source] + edge.weight;
        predecessors[edge.target] = edge.source;
        updatedInIteration = true;
        createStep(`Updated distance of ${edge.target} to ${distances[edge.target]}`, i, edge, true, edge.target);
      }
    }
    if (!updatedInIteration) {
        steps.push({ id: stepCounter++, description: "No distances updated in this iteration. Algorithm can terminate early.", state: { distances: {...distances}, iteration: i }, metrics: {}, educational_notes: []});
        break; // Early termination
    }
  }

  // Check for negative-weight cycles
  for (const edge of edges) {
    if (distances[edge.source] !== Infinity && distances[edge.source] + edge.weight < distances[edge.target]) {
        createStep("Negative-weight cycle detected!", numVertices, edge, true, edge.target, true);
        const endTime = performance.now();
        return {
            success: true,
            result: { distances, predecessors, negativeCycle: true },
            steps,
            metadata: { execution_time_ms: endTime - startTime, memory_usage_mb: 0.1, complexity: { time: 'O(VE)', space: 'O(V)' } }
        };
    }
  }

  createStep("Algorithm finished. No negative-weight cycles detected.", numVertices, null, false);

  const endTime = performance.now();
  return {
    success: true,
    result: { distances, predecessors, negativeCycle: false },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(VE)', space: 'O(V)' }
    }
  };
};
