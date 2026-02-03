import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export interface Point {
  x: number;
  y: number;
  cluster?: number;
  pointType?: 'core' | 'border' | 'noise' | 'unvisited';
}

interface DBSCANState {
  points: Point[];
  currentCluster: number;
  visitedPoints: Set<number>;
  currentPoint?: number;
  neighbors?: number[];
}

// Calculate Euclidean distance between two points
function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Get all neighbors within eps distance
function getNeighbors(points: Point[], pointIdx: number, eps: number): number[] {
  const neighbors: number[] = [];
  const point = points[pointIdx];
  
  for (let i = 0; i < points.length; i++) {
    if (euclideanDistance(point, points[i]) <= eps) {
      neighbors.push(i);
    }
  }
  
  return neighbors;
}

// Expand cluster from a core point
function expandCluster(
  points: Point[],
  pointIdx: number,
  neighbors: number[],
  cluster: number,
  eps: number,
  minPts: number,
  visited: Set<number>,
  steps: AlgorithmStep[]
): void {
  // Assign point to cluster
  points[pointIdx].cluster = cluster;
  points[pointIdx].pointType = 'core';
  
  let i = 0;
  while (i < neighbors.length) {
    const neighborIdx = neighbors[i];
    
    if (!visited.has(neighborIdx)) {
      visited.add(neighborIdx);
      
      // Get neighbors of this neighbor
      const neighborNeighbors = getNeighbors(points, neighborIdx, eps);
      
      // Create step for visiting this neighbor
      steps.push({
        id: steps.length,
        description: `Visiting point ${neighborIdx}, found ${neighborNeighbors.length} neighbors`,
        state: {
          points: points.map(p => ({ ...p })),
          currentCluster: cluster,
          visitedPoints: new Set(visited),
          currentPoint: neighborIdx,
          neighbors: neighborNeighbors
        },
        metrics: {
          clustersFound: cluster,
          visitedCount: visited.size,
          currentNeighborCount: neighborNeighbors.length
        },
        educational_notes: [
          neighborNeighbors.length >= minPts
            ? `Point ${neighborIdx} is a core point (${neighborNeighbors.length} >= ${minPts} neighbors)`
            : `Point ${neighborIdx} is a border point (${neighborNeighbors.length} < ${minPts} neighbors)`
        ]
      });
      
      // If neighbor is also a core point, add its neighbors to the queue
      if (neighborNeighbors.length >= minPts) {
        points[neighborIdx].pointType = 'core';
        neighborNeighbors.forEach(newNeighborIdx => {
          if (!neighbors.includes(newNeighborIdx)) {
            neighbors.push(newNeighborIdx);
          }
        });
      } else {
        points[neighborIdx].pointType = 'border';
      }
      
      // Assign neighbor to cluster if not already assigned
      if (points[neighborIdx].cluster === undefined) {
        points[neighborIdx].cluster = cluster;
      }
    }
    
    i++;
  }
}

export function getDBSCANSimulation(
  inputPoints: Point[],
  eps: number,
  minPts: number
): AlgorithmSimulation {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  
  if (inputPoints.length === 0) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n²)',
          space: 'O(n)'
        }
      }
    };
  }
  
  if (eps <= 0 || minPts <= 0) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n²)',
          space: 'O(n)'
        }
      }
    };
  }
  
  // Initialize points with unvisited status
  const points: Point[] = inputPoints.map(p => ({
    ...p,
    cluster: undefined,
    pointType: 'unvisited'
  }));
  
  // Initial step
  steps.push({
    id: 0,
    description: `DBSCAN initialized with eps=${eps.toFixed(2)}, minPts=${minPts}, ${points.length} points`,
    state: {
      points: points.map(p => ({ ...p })),
      currentCluster: -1,
      visitedPoints: new Set<number>(),
      currentPoint: undefined,
      neighbors: []
    },
    metrics: {
      clustersFound: 0,
      visitedCount: 0,
      corePoints: 0,
      borderPoints: 0,
      noisePoints: 0
    },
    educational_notes: [
      'DBSCAN (Density-Based Spatial Clustering of Applications with Noise)',
      `eps (ε) = ${eps.toFixed(2)}: maximum distance between two points to be neighbors`,
      `minPts = ${minPts}: minimum number of points to form a dense region (cluster)`
    ]
  });
  
  const visited = new Set<number>();
  let currentCluster = 0;
  
  // Process each point
  for (let i = 0; i < points.length; i++) {
    if (visited.has(i)) {
      continue;
    }
    
    visited.add(i);
    
    // Find neighbors
    const neighbors = getNeighbors(points, i, eps);
    
    // Create step for checking this point
    steps.push({
      id: steps.length,
      description: `Checking point ${i}, found ${neighbors.length} neighbors within eps=${eps.toFixed(2)}`,
      state: {
        points: points.map(p => ({ ...p })),
        currentCluster: currentCluster,
        visitedPoints: new Set(visited),
        currentPoint: i,
        neighbors: neighbors
      },
      metrics: {
        clustersFound: currentCluster,
        visitedCount: visited.size,
        currentNeighborCount: neighbors.length
      },
      educational_notes: [
        neighbors.length >= minPts
          ? `Point ${i} is a CORE point (${neighbors.length} >= ${minPts}), starting new cluster ${currentCluster}`
          : `Point ${i} has insufficient neighbors (${neighbors.length} < ${minPts}), marking as noise for now`
      ]
    });
    
    // Check if core point
    if (neighbors.length >= minPts) {
      // Start new cluster
      expandCluster(points, i, neighbors, currentCluster, eps, minPts, visited, steps);
      
      // Create step after expanding cluster
      const clusterSize = points.filter(p => p.cluster === currentCluster).length;
      steps.push({
        id: steps.length,
        description: `Cluster ${currentCluster} expanded with ${clusterSize} points`,
        state: {
          points: points.map(p => ({ ...p })),
          currentCluster: currentCluster,
          visitedPoints: new Set(visited),
          currentPoint: undefined,
          neighbors: []
        },
        metrics: {
          clustersFound: currentCluster + 1,
          visitedCount: visited.size,
          clusterSize: clusterSize
        },
        educational_notes: [
          `Cluster ${currentCluster} formation complete`,
          'All density-reachable points from the core point have been added to the cluster'
        ]
      });
      
      currentCluster++;
    } else {
      // Mark as noise (may be changed to border later)
      points[i].pointType = 'noise';
    }
  }
  
  // Final classification pass - identify any remaining noise points
  points.forEach((point, idx) => {
    if (point.cluster === undefined) {
      point.pointType = 'noise';
    }
  });
  
  // Calculate final metrics
  const corePoints = points.filter(p => p.pointType === 'core').length;
  const borderPoints = points.filter(p => p.pointType === 'border').length;
  const noisePoints = points.filter(p => p.pointType === 'noise').length;
  const clusterSizes: number[] = [];
  
  for (let c = 0; c < currentCluster; c++) {
    clusterSizes.push(points.filter(p => p.cluster === c).length);
  }
  
  // Final step
  steps.push({
    id: steps.length,
    description: `DBSCAN complete: ${currentCluster} clusters found, ${noisePoints} noise points`,
    state: {
      points: points.map(p => ({ ...p })),
      currentCluster: currentCluster,
      visitedPoints: visited,
      currentPoint: undefined,
      neighbors: []
    },
    metrics: {
      clustersFound: currentCluster,
      corePoints: corePoints,
      borderPoints: borderPoints,
      noisePoints: noisePoints,
      clusterSizes: clusterSizes,
      visitedCount: visited.size
    },
    educational_notes: [
      'DBSCAN clustering complete',
      `Core points: ${corePoints} (points with >= ${minPts} neighbors)`,
      `Border points: ${borderPoints} (in cluster but not core)`,
      `Noise points: ${noisePoints} (not in any cluster)`,
      'Unlike K-Means, DBSCAN can find arbitrarily-shaped clusters and identify outliers'
    ]
  });
  
  const endTime = performance.now();
  
  return {
    success: true,
    result: {
      points: points,
      clusters: currentCluster,
      corePoints: corePoints,
      borderPoints: borderPoints,
      noisePoints: noisePoints,
      clusterSizes: clusterSizes
    },
    steps: steps,
    metadata: {
      execution_time_ms: parseFloat((endTime - startTime).toFixed(2)),
      memory_usage_mb: parseFloat(((steps.length * 1000) / (1024 * 1024)).toFixed(2)),
      complexity: {
        time: 'O(n²) - can be O(n log n) with spatial indexing',
        space: 'O(n)'
      }
    }
  };
}