
import type { AlgorithmSimulation, AlgorithmStep, GraphNode, GraphEdge } from '../types';

// Disjoint Set Union (DSU) or Union-Find
class DSU {
    parent: Record<string, string> = {};
    constructor(nodes: GraphNode[]) {
        nodes.forEach(node => {
            this.parent[node.id] = node.id;
        });
    }

    find(i: string): string {
        if (this.parent[i] === i) {
            return i;
        }
        // Path compression
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    union(i: string, j: string) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
        }
    }
}

export const getKruskalSimulation = (nodes: GraphNode[], edges: GraphEdge[]): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DSU(nodes);
  const mstEdges: GraphEdge[] = [];
  let totalWeight = 0;

  const createStep = (description: string, currentEdge: GraphEdge | null, status: 'checking' | 'accepted' | 'rejected', currentEdgeIndex: number) => {
    steps.push({
      id: stepCounter++,
      description,
      state: {
        mstEdges: [...mstEdges],
        currentEdge,
        status,
        sortedEdges,
        currentEdgeIndex,
      },
      metrics: { totalWeight },
      educational_notes: [],
    });
  };

  createStep("Initial state. Edges are sorted by weight.", null, 'checking', -1);

  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const { source, target, weight } = edge;

    createStep(`Checking edge (${source}, ${target}) with weight ${weight}.`, edge, 'checking', i);

    const rootSource = dsu.find(source);
    const rootTarget = dsu.find(target);

    if (rootSource !== rootTarget) {
      mstEdges.push(edge);
      dsu.union(source, target);
      totalWeight += weight;
      createStep(`Accepted edge (${source}, ${target}). No cycle formed.`, edge, 'accepted', i);
    } else {
      createStep(`Rejected edge (${source}, ${target}). It would form a cycle.`, edge, 'rejected', i);
    }
    
    if (mstEdges.length === nodes.length - 1) {
        break;
    }
  }

  createStep("MST construction complete.", null, 'checking', -1);

  const endTime = performance.now();
  return {
    success: true,
    result: { mst: mstEdges, weight: totalWeight },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.2,
      complexity: { time: 'O(E log E)', space: 'O(V + E)' }
    }
  };
};
