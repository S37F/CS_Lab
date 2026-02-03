
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export type HeuristicType = 'manhattan' | 'euclidean' | 'chebyshev';

export interface GridCell {
  row: number;
  col: number;
  isObstacle: boolean;
}

export interface AStarNode {
  row: number;
  col: number;
  g: number; // Cost from start
  h: number; // Heuristic cost to goal
  f: number; // Total cost (g + h)
  parent: AStarNode | null;
}

const manhattanDistance = (row1: number, col1: number, row2: number, col2: number): number => {
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
};

const euclideanDistance = (row1: number, col1: number, row2: number, col2: number): number => {
  return Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2));
};

const chebyshevDistance = (row1: number, col1: number, row2: number, col2: number): number => {
  return Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));
};

const getHeuristic = (heuristicType: HeuristicType) => {
  switch (heuristicType) {
    case 'manhattan':
      return manhattanDistance;
    case 'euclidean':
      return euclideanDistance;
    case 'chebyshev':
      return chebyshevDistance;
    default:
      return manhattanDistance;
  }
};

const getNeighbors = (node: AStarNode, gridSize: number): Array<{row: number, col: number}> => {
  const neighbors = [];
  const directions = [
    { row: -1, col: 0 },  // Up
    { row: 1, col: 0 },   // Down
    { row: 0, col: -1 },  // Left
    { row: 0, col: 1 },   // Right
  ];
  
  for (const dir of directions) {
    const newRow = node.row + dir.row;
    const newCol = node.col + dir.col;
    
    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

const reconstructPath = (node: AStarNode): Array<{row: number, col: number}> => {
  const path = [];
  let current: AStarNode | null = node;
  
  while (current !== null) {
    path.unshift({ row: current.row, col: current.col });
    current = current.parent;
  }
  
  return path;
};

export const getAStarSimulation = (
  gridSize: number,
  obstacles: Array<{row: number, col: number}>,
  start: {row: number, col: number},
  goal: {row: number, col: number},
  heuristicType: HeuristicType
): AlgorithmSimulation => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepCounter = 0;
  
  // Create obstacle set for quick lookup
  const obstacleSet = new Set(obstacles.map(obs => `${obs.row},${obs.col}`));
  
  const heuristic = getHeuristic(heuristicType);
  
  const openList: AStarNode[] = [];
  const closedSet = new Set<string>();
  const gScores: Record<string, number> = {};
  const nodeMap: Record<string, AStarNode> = {};
  
  const createStep = (
    description: string,
    currentNode: AStarNode | null,
    neighbors: Array<{row: number, col: number}> = [],
    path: Array<{row: number, col: number}> = [],
    nodesExplored: number,
    educational_notes: string[] = []
  ) => {
    const openListData = openList.map(node => ({
      position: { row: node.row, col: node.col },
      f: node.f,
      g: node.g,
      h: node.h
    })).sort((a, b) => a.f - b.f);
    
    steps.push({
      id: stepCounter++,
      description,
      state: {
        currentNode: currentNode ? { row: currentNode.row, col: currentNode.col } : null,
        openList: openListData,
        closedList: Array.from(closedSet).map(key => {
          const [row, col] = key.split(',').map(Number);
          return { row, col };
        }),
        neighbors: neighbors,
        path: path,
        nodeValues: Object.fromEntries(
          Object.entries(nodeMap).map(([key, node]) => [key, { f: node.f, g: node.g, h: node.h }])
        )
      },
      metrics: {
        nodesExplored,
        pathLength: path.length,
        pathCost: currentNode?.g || 0,
        openListSize: openList.length,
        closedListSize: closedSet.size
      },
      educational_notes
    });
  };
  
  // Initialize start node
  const startNode: AStarNode = {
    row: start.row,
    col: start.col,
    g: 0,
    h: heuristic(start.row, start.col, goal.row, goal.col),
    f: heuristic(start.row, start.col, goal.row, goal.col),
    parent: null
  };
  
  const startKey = `${start.row},${start.col}`;
  openList.push(startNode);
  gScores[startKey] = 0;
  nodeMap[startKey] = startNode;
  
  createStep(
    `Initialization: Start at (${start.row}, ${start.col}), Goal at (${goal.row}, ${goal.col}). Using ${heuristicType} heuristic.`,
    null,
    [],
    [],
    0,
    [
      `A* Search uses f(n) = g(n) + h(n) where g(n) is the cost from start, and h(n) is the heuristic estimate to the goal.`,
      `The ${heuristicType} heuristic is used to estimate the distance to the goal.`
    ]
  );
  
  let nodesExplored = 0;
  let goalFound = false;
  let finalPath: Array<{row: number, col: number}> = [];
  
  while (openList.length > 0) {
    // Find node with minimum f value
    let minIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[minIndex].f) {
        minIndex = i;
      }
    }
    
    const current = openList[minIndex];
    const currentKey = `${current.row},${current.col}`;
    
    createStep(
      `Selecting node (${current.row}, ${current.col}) with lowest f-value: f=${current.f.toFixed(2)}, g=${current.g.toFixed(2)}, h=${current.h.toFixed(2)}`,
      current,
      [],
      [],
      nodesExplored,
      [
        `Among all nodes in the open list, (${current.row}, ${current.col}) has the lowest f-value, making it the most promising node to explore.`
      ]
    );
    
    // Check if we reached the goal
    if (current.row === goal.row && current.col === goal.col) {
      finalPath = reconstructPath(current);
      goalFound = true;
      createStep(
        `Goal reached! Path found from (${start.row}, ${start.col}) to (${goal.row}, ${goal.col})`,
        current,
        [],
        finalPath,
        nodesExplored,
        [
          `The A* algorithm has successfully found the optimal path.`,
          `Path length: ${finalPath.length} cells`,
          `Total cost: ${current.g.toFixed(2)}`
        ]
      );
      break;
    }
    
    // Move current from open to closed
    openList.splice(minIndex, 1);
    closedSet.add(currentKey);
    nodesExplored++;
    
    const neighbors = getNeighbors(current, gridSize);
    const validNeighbors = neighbors.filter(n => !obstacleSet.has(`${n.row},${n.col}`));
    
    createStep(
      `Exploring neighbors of (${current.row}, ${current.col}). Found ${validNeighbors.length} valid neighbors.`,
      current,
      validNeighbors,
      [],
      nodesExplored
    );
    
    for (const neighbor of validNeighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      
      // Skip if in closed list
      if (closedSet.has(neighborKey)) {
        continue;
      }
      
      // Calculate tentative g score
      const tentativeG = current.g + 1; // Assuming uniform cost of 1 for each move
      
      // Check if this path to neighbor is better than any previous one
      const previousG = gScores[neighborKey];
      
      if (previousG === undefined || tentativeG < previousG) {
        // This path is better, so record it
        const h = heuristic(neighbor.row, neighbor.col, goal.row, goal.col);
        const f = tentativeG + h;
        
        const neighborNode: AStarNode = {
          row: neighbor.row,
          col: neighbor.col,
          g: tentativeG,
          h: h,
          f: f,
          parent: current
        };
        
        gScores[neighborKey] = tentativeG;
        nodeMap[neighborKey] = neighborNode;
        
        // Check if neighbor is already in open list
        const existingIndex = openList.findIndex(n => n.row === neighbor.row && n.col === neighbor.col);
        if (existingIndex !== -1) {
          openList[existingIndex] = neighborNode;
          createStep(
            `Updating (${neighbor.row}, ${neighbor.col}): Found a better path. New f=${f.toFixed(2)} (g=${tentativeG.toFixed(2)}, h=${h.toFixed(2)})`,
            current,
            [neighbor],
            [],
            nodesExplored,
            [`A shorter path to this node was found, so we update its cost values.`]
          );
        } else {
          openList.push(neighborNode);
          createStep(
            `Adding (${neighbor.row}, ${neighbor.col}) to open list: f=${f.toFixed(2)} (g=${tentativeG.toFixed(2)}, h=${h.toFixed(2)})`,
            current,
            [neighbor],
            [],
            nodesExplored,
            [`This neighbor is reachable and hasn't been fully explored yet, so we add it to the frontier.`]
          );
        }
      }
    }
  }
  
  if (!goalFound) {
    createStep(
      `No path found! The goal is unreachable from the start position.`,
      null,
      [],
      [],
      nodesExplored,
      [
        `The open list is empty and the goal was never reached.`,
        `This means there is no valid path from start to goal with the given obstacles.`
      ]
    );
  }
  
  const endTime = performance.now();
  
  return {
    success: goalFound,
    result: {
      path: finalPath,
      pathLength: finalPath.length,
      pathCost: finalPath.length > 0 ? gScores[`${goal.row},${goal.col}`] : 0,
      nodesExplored
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.5,
      complexity: {
        time: 'O(b^d) where b is branching factor and d is depth',
        space: 'O(b^d)'
      }
    }
  };
};
