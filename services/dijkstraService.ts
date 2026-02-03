
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../types';

export const getDijkstraSimulation = (nodes: GraphNode[], edges: GraphEdge[], startNode: string): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const adj: Record<string, { node: string; weight: number }[]> = {};
  nodes.forEach(node => adj[node.id] = []);
  edges.forEach(edge => {
    adj[edge.source].push({ node: edge.target, weight: edge.weight });
  });

  const distances: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const pq = new Set<string>();

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
    pq.add(node.id);
  });
  distances[startNode] = 0;

  const createStep = (description: string, currentNode: string | null, visited: string[], updated: string | null = null) => {
    steps.push({
      id: stepCounter++,
      description,
      state: { distances: { ...distances }, currentNode, visited: [...visited], updated },
      metrics: {},
      educational_notes: [],
    });
  };

  createStep("Initialization: Distances set to infinity, 0 for the start node.", null, []);

  let visited: string[] = [];
  while (pq.size > 0) {
    let u = '';
    let minDistance = Infinity;
    pq.forEach(node => {
        if(distances[node] < minDistance) {
            minDistance = distances[node];
            u = node;
        }
    });

    if(!u) break; // No path to remaining nodes

    pq.delete(u);
    visited.push(u);
    createStep(`Visiting node ${u}. It has the smallest distance among unvisited nodes.`, u, visited);

    adj[u].forEach(neighbor => {
      if (pq.has(neighbor.node)) {
        const alt = distances[u] + neighbor.weight;
        createStep(`Checking neighbor ${neighbor.node}. Current distance is ${distances[neighbor.node]}.`, u, visited);
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          prev[neighbor.node] = u;
          createStep(`Found a shorter path to ${neighbor.node}. Updating distance to ${alt}.`, u, visited, neighbor.node);
        }
      }
    });
  }

  createStep("Algorithm finished. All reachable nodes have been visited.", null, visited);
  
  const endTime = performance.now();
  return {
    success: true,
    result: { distances, prev },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(V^2)', space: 'O(V)' }
    }
  };
};
