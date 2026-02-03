import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export interface Point {
  x: number;
  y: number;
  cluster?: number;
}

export interface Centroid {
  x: number;
  y: number;
  cluster: number;
}

interface KMeansState {
  points: Point[];
  centroids: Centroid[];
  iteration: number;
  sse: number;
  converged: boolean;
}

// Calculate Euclidean distance between two points
function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Assign each point to the nearest centroid
function assignPointsToClusters(points: Point[], centroids: Centroid[]): Point[] {
  return points.map(point => {
    let minDistance = Infinity;
    let assignedCluster = 0;

    centroids.forEach(centroid => {
      const distance = euclideanDistance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        assignedCluster = centroid.cluster;
      }
    });

    return { ...point, cluster: assignedCluster };
  });
}

// Calculate new centroids based on current cluster assignments
function updateCentroids(points: Point[], k: number): Centroid[] {
  const newCentroids: Centroid[] = [];

  for (let i = 0; i < k; i++) {
    const clusterPoints = points.filter(p => p.cluster === i);
    
    if (clusterPoints.length === 0) {
      // If a cluster has no points, keep the old centroid or use a random point
      const randomPoint = points[Math.floor(Math.random() * points.length)];
      newCentroids.push({ x: randomPoint.x, y: randomPoint.y, cluster: i });
    } else {
      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
      newCentroids.push({
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length,
        cluster: i
      });
    }
  }

  return newCentroids;
}

// Calculate Sum of Squared Errors (SSE)
function calculateSSE(points: Point[], centroids: Centroid[]): number {
  let sse = 0;
  points.forEach(point => {
    const centroid = centroids.find(c => c.cluster === point.cluster);
    if (centroid) {
      sse += Math.pow(euclideanDistance(point, centroid), 2);
    }
  });
  return sse;
}

// Check if centroids have converged (within threshold)
function hasConverged(oldCentroids: Centroid[], newCentroids: Centroid[], threshold: number = 0.0001): boolean {
  for (let i = 0; i < oldCentroids.length; i++) {
    const distance = euclideanDistance(oldCentroids[i], newCentroids[i]);
    if (distance > threshold) {
      return false;
    }
  }
  return true;
}

// Initialize centroids using k-means++ algorithm for better initial positions
function initializeCentroidsKMeansPlusPlus(points: Point[], k: number): Centroid[] {
  const centroids: Centroid[] = [];
  
  // Choose first centroid randomly
  const firstPoint = points[Math.floor(Math.random() * points.length)];
  centroids.push({ x: firstPoint.x, y: firstPoint.y, cluster: 0 });

  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances: number[] = points.map(point => {
      // Find minimum distance to existing centroids
      return Math.min(...centroids.map(c => Math.pow(euclideanDistance(point, c), 2)));
    });

    // Calculate cumulative distances for weighted random selection
    const totalDistance = distances.reduce((sum, d) => sum + d, 0);
    let randomValue = Math.random() * totalDistance;
    
    let selectedIndex = 0;
    for (let j = 0; j < distances.length; j++) {
      randomValue -= distances[j];
      if (randomValue <= 0) {
        selectedIndex = j;
        break;
      }
    }

    const selectedPoint = points[selectedIndex];
    centroids.push({ x: selectedPoint.x, y: selectedPoint.y, cluster: i });
  }

  return centroids;
}

export function getKMeansSimulation(points: Point[], k: number, maxIterations: number = 50): AlgorithmSimulation {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];

  if (points.length === 0) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n * k * i)',
          space: 'O(n + k)'
        }
      }
    };
  }

  if (k <= 0 || k > points.length) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n * k * i)',
          space: 'O(n + k)'
        }
      }
    };
  }

  // Initialize centroids using k-means++
  let centroids = initializeCentroidsKMeansPlusPlus(points, k);
  let assignedPoints = points.map(p => ({ ...p }));

  // Initial step - showing initialization
  steps.push({
    id: 0,
    description: `Initialized ${k} centroids using K-Means++ algorithm`,
    state: {
      points: assignedPoints,
      centroids: centroids,
      iteration: 0,
      converged: false
    },
    metrics: {
      sse: 0,
      clusterSizes: Array(k).fill(0)
    },
    educational_notes: [
      'K-Means++ initialization chooses initial centroids that are far apart',
      'This helps avoid poor local minima and speeds up convergence'
    ]
  });

  let converged = false;
  let iteration = 1;

  while (!converged && iteration <= maxIterations) {
    // Step 1: Assign points to nearest centroid
    assignedPoints = assignPointsToClusters(assignedPoints, centroids);
    const sse = calculateSSE(assignedPoints, centroids);
    
    const clusterSizes = Array(k).fill(0);
    assignedPoints.forEach(p => {
      if (p.cluster !== undefined) {
        clusterSizes[p.cluster]++;
      }
    });

    steps.push({
      id: steps.length,
      description: `Iteration ${iteration}: Assigned each point to the nearest centroid`,
      state: {
        points: assignedPoints.map(p => ({ ...p })),
        centroids: centroids.map(c => ({ ...c })),
        iteration: iteration,
        converged: false,
        phase: 'assignment'
      },
      metrics: {
        sse: parseFloat(sse.toFixed(4)),
        clusterSizes: clusterSizes
      },
      educational_notes: [
        'Each point is assigned to the cluster with the nearest centroid',
        'Distance is measured using Euclidean distance: √((x₁-x₂)² + (y₁-y₂)²)'
      ]
    });

    // Step 2: Update centroids
    const oldCentroids = centroids;
    centroids = updateCentroids(assignedPoints, k);
    
    converged = hasConverged(oldCentroids, centroids);

    steps.push({
      id: steps.length,
      description: `Iteration ${iteration}: Recalculated centroids as the mean of points in each cluster`,
      state: {
        points: assignedPoints.map(p => ({ ...p })),
        centroids: centroids.map(c => ({ ...c })),
        iteration: iteration,
        converged: converged,
        phase: 'update'
      },
      metrics: {
        sse: parseFloat(sse.toFixed(4)),
        clusterSizes: clusterSizes,
        centroidMovement: oldCentroids.map((old, i) => 
          parseFloat(euclideanDistance(old, centroids[i]).toFixed(4))
        )
      },
      educational_notes: [
        'New centroids are calculated as the mean position of all points in the cluster',
        converged 
          ? 'Centroids have converged - algorithm complete!' 
          : 'Centroids moved - continuing to next iteration'
      ]
    });

    iteration++;
  }

  // Final step
  const finalSSE = calculateSSE(assignedPoints, centroids);
  const finalClusterSizes = Array(k).fill(0);
  assignedPoints.forEach(p => {
    if (p.cluster !== undefined) {
      finalClusterSizes[p.cluster]++;
    }
  });

  steps.push({
    id: steps.length,
    description: converged 
      ? `Algorithm converged after ${iteration - 1} iterations` 
      : `Maximum iterations (${maxIterations}) reached`,
    state: {
      points: assignedPoints,
      centroids: centroids,
      iteration: iteration - 1,
      converged: converged
    },
    metrics: {
      sse: parseFloat(finalSSE.toFixed(4)),
      clusterSizes: finalClusterSizes,
      totalIterations: iteration - 1
    },
    educational_notes: [
      `K-Means clustering completed with ${k} clusters`,
      `Final SSE (Sum of Squared Errors): ${finalSSE.toFixed(4)}`,
      'Lower SSE indicates tighter, more compact clusters'
    ]
  });

  const endTime = performance.now();

  return {
    success: true,
    result: {
      points: assignedPoints,
      centroids: centroids,
      sse: finalSSE,
      iterations: iteration - 1,
      converged: converged
    },
    steps: steps,
    metadata: {
      execution_time_ms: parseFloat((endTime - startTime).toFixed(2)),
      memory_usage_mb: parseFloat(((steps.length * 1000) / (1024 * 1024)).toFixed(2)),
      complexity: {
        time: 'O(n * k * i) where n=points, k=clusters, i=iterations',
        space: 'O(n + k)'
      }
    }
  };
}
