
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../types';

export const getBfsDfsSimulation = (nodes: GraphNode[], edges: GraphEdge[], startNode: string, mode: 'bfs' | 'dfs'): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const adj: Record<string, string[]> = {};
  nodes.forEach(node => adj[node.id] = []);
  edges.forEach(edge => {
    adj[edge.source].push(edge.target);
    adj[edge.target].push(edge.source); // Assuming undirected graph
  });

  const visited = new Set<string>();
  const structure: string[] = []; // This will be a queue for BFS, stack for DFS

  const createStep = (description: string, currentNode: string | null) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        currentNode,
        visited: Array.from(visited),
        structure: [...structure],
      },
      metrics: {},
      educational_notes: [],
    });
  };

  createStep(`Initial state. Starting traversal from node ${startNode}.`, null);

  structure.push(startNode);
  visited.add(startNode);
  createStep(`Add ${startNode} to the ${mode === 'bfs' ? 'queue' : 'stack'} and mark as visited.`, null);

  while (structure.length > 0) {
    const u = mode === 'bfs' ? structure.shift()! : structure.pop()!;
    createStep(`Processing node ${u}.`, u);

    // Get neighbors and sort them alphabetically for deterministic order
    const neighbors = adj[u].sort();
    
    for (const v of neighbors) {
      if (!visited.has(v)) {
        visited.add(v);
        structure.push(v);
        createStep(`Visiting neighbor ${v}. Adding to ${mode === 'bfs' ? 'queue' : 'stack'} and marking as visited.`, u);
      }
    }
  }

  createStep("Traversal complete. All reachable nodes have been visited.", null);

  const endTime = performance.now();
  return {
    success: true,
    result: { visited: Array.from(visited) },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(V + E)', space: 'O(V)' }
    }
  };
};
