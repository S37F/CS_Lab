
import type { AlgorithmSimulation, AlgorithmStep } from '../types';

// 8-Puzzle State representation (3x3 grid)
export type PuzzleState = number[][]; // 0 represents the blank tile
export type SearchType = 'BFS' | 'DFS';

interface SearchNode {
  state: PuzzleState;
  parent: SearchNode | null;
  depth: number;
  action: string;
}

// Helper function to convert state to string for comparison
function stateToString(state: PuzzleState): string {
  return state.flat().join(',');
}

// Helper function to find the position of the blank (0) tile
function findBlank(state: PuzzleState): [number, number] {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state[i][j] === 0) return [i, j];
    }
  }
  return [0, 0];
}

// Helper function to deep copy a state
function copyState(state: PuzzleState): PuzzleState {
  return state.map(row => [...row]);
}

// Check if two states are equal
function statesEqual(state1: PuzzleState, state2: PuzzleState): boolean {
  return stateToString(state1) === stateToString(state2);
}

// Generate all possible successor states
function getSuccessors(state: PuzzleState): Array<{state: PuzzleState, action: string}> {
  const [blankRow, blankCol] = findBlank(state);
  const successors: Array<{state: PuzzleState, action: string}> = [];
  
  // Possible moves: Up, Down, Left, Right
  const moves = [
    { dr: -1, dc: 0, name: 'Move Down' },  // Moving blank up means tile moves down
    { dr: 1, dc: 0, name: 'Move Up' },     // Moving blank down means tile moves up
    { dr: 0, dc: -1, name: 'Move Right' }, // Moving blank left means tile moves right
    { dr: 0, dc: 1, name: 'Move Left' }    // Moving blank right means tile moves left
  ];
  
  for (const move of moves) {
    const newRow = blankRow + move.dr;
    const newCol = blankCol + move.dc;
    
    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      const newState = copyState(state);
      // Swap blank with the tile
      newState[blankRow][blankCol] = newState[newRow][newCol];
      newState[newRow][newCol] = 0;
      
      successors.push({
        state: newState,
        action: `${move.name} (${newState[blankRow][blankCol]})`
      });
    }
  }
  
  return successors;
}

// Build path from start to goal
function buildPath(node: SearchNode): SearchNode[] {
  const path: SearchNode[] = [];
  let current: SearchNode | null = node;
  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

// Main simulation function for BFS
export function getBFSSimulation(
  initialState: PuzzleState,
  goalState: PuzzleState
): AlgorithmSimulation {
  const steps: AlgorithmStep[] = [];
  const startTime = performance.now();
  
  const startNode: SearchNode = {
    state: initialState,
    parent: null,
    depth: 0,
    action: 'Initial State'
  };
  
  const frontier: SearchNode[] = [startNode]; // Queue for BFS
  const visited = new Set<string>();
  visited.add(stateToString(initialState));
  
  let stepId = 0;
  let goalFound = false;
  let finalPath: SearchNode[] = [];
  
  // Initial step
  steps.push({
    id: stepId++,
    description: 'Initialize BFS with the initial state in the frontier (queue)',
    state: {
      currentNode: startNode,
      frontier: [...frontier],
      visited: Array.from(visited),
      goalFound: false,
      path: [],
      searchType: 'BFS'
    },
    metrics: {
      frontierSize: frontier.length,
      visitedSize: visited.size,
      depth: 0
    },
    educational_notes: [
      'BFS uses a queue (FIFO) to explore states level by level',
      'BFS guarantees the shortest path solution',
      'BFS explores all nodes at depth d before exploring nodes at depth d+1'
    ]
  });
  
  let iterations = 0;
  const maxIterations = 1000; // Prevent infinite loops
  
  while (frontier.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Dequeue (BFS uses FIFO)
    const currentNode = frontier.shift()!;
    
    steps.push({
      id: stepId++,
      description: `Dequeue state from frontier (depth ${currentNode.depth}). Checking if goal is reached.`,
      state: {
        currentNode,
        frontier: [...frontier],
        visited: Array.from(visited),
        goalFound: false,
        path: buildPath(currentNode),
        searchType: 'BFS',
        action: currentNode.action
      },
      metrics: {
        frontierSize: frontier.length,
        visitedSize: visited.size,
        depth: currentNode.depth
      },
      educational_notes: [
        `Exploring state at depth ${currentNode.depth}`,
        `Current frontier size: ${frontier.length}`,
        `Total states visited: ${visited.size}`
      ]
    });
    
    // Check if goal is reached
    if (statesEqual(currentNode.state, goalState)) {
      goalFound = true;
      finalPath = buildPath(currentNode);
      
      steps.push({
        id: stepId++,
        description: `🎉 Goal state found! Solution depth: ${currentNode.depth}`,
        state: {
          currentNode,
          frontier: [...frontier],
          visited: Array.from(visited),
          goalFound: true,
          path: finalPath,
          searchType: 'BFS'
        },
        metrics: {
          frontierSize: frontier.length,
          visitedSize: visited.size,
          depth: currentNode.depth,
          solutionDepth: currentNode.depth,
          pathLength: finalPath.length
        },
        educational_notes: [
          `Goal found at depth ${currentNode.depth}`,
          `Total states explored: ${visited.size}`,
          `BFS guarantees this is the shortest path`,
          `Path length: ${finalPath.length} states`
        ]
      });
      break;
    }
    
    // Generate successors
    const successors = getSuccessors(currentNode.state);
    const newSuccessors: SearchNode[] = [];
    
    for (const successor of successors) {
      const stateStr = stateToString(successor.state);
      
      if (!visited.has(stateStr)) {
        visited.add(stateStr);
        const childNode: SearchNode = {
          state: successor.state,
          parent: currentNode,
          depth: currentNode.depth + 1,
          action: successor.action
        };
        frontier.push(childNode); // Enqueue for BFS
        newSuccessors.push(childNode);
      }
    }
    
    if (newSuccessors.length > 0) {
      steps.push({
        id: stepId++,
        description: `Generated ${newSuccessors.length} new successor state(s). Adding to back of queue.`,
        state: {
          currentNode,
          frontier: [...frontier],
          visited: Array.from(visited),
          goalFound: false,
          path: buildPath(currentNode),
          successors: newSuccessors,
          searchType: 'BFS'
        },
        metrics: {
          frontierSize: frontier.length,
          visitedSize: visited.size,
          depth: currentNode.depth,
          successorsGenerated: newSuccessors.length
        },
        educational_notes: [
          `Generated ${successors.length} possible moves, ${newSuccessors.length} were unvisited`,
          'New states are added to the back of the queue',
          'BFS explores breadth-first, ensuring shortest path'
        ]
      });
    }
  }
  
  if (!goalFound) {
    steps.push({
      id: stepId++,
      description: iterations >= maxIterations 
        ? '⚠️ Search terminated: Maximum iterations reached'
        : '⚠️ Search terminated: No solution found (frontier empty)',
      state: {
        currentNode: null,
        frontier: [],
        visited: Array.from(visited),
        goalFound: false,
        path: [],
        searchType: 'BFS'
      },
      metrics: {
        frontierSize: 0,
        visitedSize: visited.size,
        depth: 0
      },
      educational_notes: [
        'No solution exists or search space is too large',
        `Total states explored: ${visited.size}`
      ]
    });
  }
  
  const endTime = performance.now();
  
  return {
    success: goalFound,
    result: {
      goalFound,
      path: finalPath,
      pathLength: finalPath.length,
      statesExplored: visited.size
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0,
      complexity: {
        time: 'O(b^d) where b is branching factor and d is depth',
        space: 'O(b^d)'
      }
    }
  };
}

// Main simulation function for DFS
export function getDFSSimulation(
  initialState: PuzzleState,
  goalState: PuzzleState
): AlgorithmSimulation {
  const steps: AlgorithmStep[] = [];
  const startTime = performance.now();
  
  const startNode: SearchNode = {
    state: initialState,
    parent: null,
    depth: 0,
    action: 'Initial State'
  };
  
  const frontier: SearchNode[] = [startNode]; // Stack for DFS
  const visited = new Set<string>();
  visited.add(stateToString(initialState));
  
  let stepId = 0;
  let goalFound = false;
  let finalPath: SearchNode[] = [];
  
  // Initial step
  steps.push({
    id: stepId++,
    description: 'Initialize DFS with the initial state in the frontier (stack)',
    state: {
      currentNode: startNode,
      frontier: [...frontier],
      visited: Array.from(visited),
      goalFound: false,
      path: [],
      searchType: 'DFS'
    },
    metrics: {
      frontierSize: frontier.length,
      visitedSize: visited.size,
      depth: 0
    },
    educational_notes: [
      'DFS uses a stack (LIFO) to explore states depth-first',
      'DFS does NOT guarantee the shortest path',
      'DFS explores as deep as possible before backtracking'
    ]
  });
  
  let iterations = 0;
  const maxIterations = 1000; // Prevent infinite loops
  const maxDepth = 20; // Depth limit for DFS
  
  while (frontier.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Pop from stack (DFS uses LIFO)
    const currentNode = frontier.pop()!;
    
    steps.push({
      id: stepId++,
      description: `Pop state from frontier (depth ${currentNode.depth}). Checking if goal is reached.`,
      state: {
        currentNode,
        frontier: [...frontier],
        visited: Array.from(visited),
        goalFound: false,
        path: buildPath(currentNode),
        searchType: 'DFS',
        action: currentNode.action
      },
      metrics: {
        frontierSize: frontier.length,
        visitedSize: visited.size,
        depth: currentNode.depth
      },
      educational_notes: [
        `Exploring state at depth ${currentNode.depth}`,
        `Current frontier size: ${frontier.length}`,
        `Total states visited: ${visited.size}`
      ]
    });
    
    // Check if goal is reached
    if (statesEqual(currentNode.state, goalState)) {
      goalFound = true;
      finalPath = buildPath(currentNode);
      
      steps.push({
        id: stepId++,
        description: `🎉 Goal state found! Solution depth: ${currentNode.depth}`,
        state: {
          currentNode,
          frontier: [...frontier],
          visited: Array.from(visited),
          goalFound: true,
          path: finalPath,
          searchType: 'DFS'
        },
        metrics: {
          frontierSize: frontier.length,
          visitedSize: visited.size,
          depth: currentNode.depth,
          solutionDepth: currentNode.depth,
          pathLength: finalPath.length
        },
        educational_notes: [
          `Goal found at depth ${currentNode.depth}`,
          `Total states explored: ${visited.size}`,
          `Note: DFS does NOT guarantee shortest path`,
          `Path length: ${finalPath.length} states`
        ]
      });
      break;
    }
    
    // Only expand if within depth limit
    if (currentNode.depth >= maxDepth) {
      continue;
    }
    
    // Generate successors
    const successors = getSuccessors(currentNode.state);
    const newSuccessors: SearchNode[] = [];
    
    for (const successor of successors) {
      const stateStr = stateToString(successor.state);
      
      if (!visited.has(stateStr)) {
        visited.add(stateStr);
        const childNode: SearchNode = {
          state: successor.state,
          parent: currentNode,
          depth: currentNode.depth + 1,
          action: successor.action
        };
        frontier.push(childNode); // Push to stack for DFS
        newSuccessors.push(childNode);
      }
    }
    
    if (newSuccessors.length > 0) {
      steps.push({
        id: stepId++,
        description: `Generated ${newSuccessors.length} new successor state(s). Pushing to top of stack.`,
        state: {
          currentNode,
          frontier: [...frontier],
          visited: Array.from(visited),
          goalFound: false,
          path: buildPath(currentNode),
          successors: newSuccessors,
          searchType: 'DFS'
        },
        metrics: {
          frontierSize: frontier.length,
          visitedSize: visited.size,
          depth: currentNode.depth,
          successorsGenerated: newSuccessors.length
        },
        educational_notes: [
          `Generated ${successors.length} possible moves, ${newSuccessors.length} were unvisited`,
          'New states are pushed to the top of the stack',
          'DFS explores depth-first, diving deep before exploring alternatives'
        ]
      });
    }
  }
  
  if (!goalFound) {
    steps.push({
      id: stepId++,
      description: iterations >= maxIterations 
        ? '⚠️ Search terminated: Maximum iterations reached'
        : '⚠️ Search terminated: No solution found (frontier empty)',
      state: {
        currentNode: null,
        frontier: [],
        visited: Array.from(visited),
        goalFound: false,
        path: [],
        searchType: 'DFS'
      },
      metrics: {
        frontierSize: 0,
        visitedSize: visited.size,
        depth: 0
      },
      educational_notes: [
        'No solution found within depth limit or maximum iterations',
        `Total states explored: ${visited.size}`,
        `Depth limit: ${maxDepth}`
      ]
    });
  }
  
  const endTime = performance.now();
  
  return {
    success: goalFound,
    result: {
      goalFound,
      path: finalPath,
      pathLength: finalPath.length,
      statesExplored: visited.size
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0,
      complexity: {
        time: 'O(b^m) where b is branching factor and m is max depth',
        space: 'O(bm)'
      }
    }
  };
}

// Predefined puzzles
export const PREDEFINED_PUZZLES = {
  easy: {
    initial: [
      [1, 2, 3],
      [4, 0, 5],
      [7, 8, 6]
    ],
    goal: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ]
  },
  medium: {
    initial: [
      [1, 2, 3],
      [4, 5, 6],
      [0, 7, 8]
    ],
    goal: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ]
  },
  hard: {
    initial: [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8]
    ],
    goal: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ]
  },
  veryHard: {
    initial: [
      [1, 2, 3],
      [0, 4, 6],
      [7, 5, 8]
    ],
    goal: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ]
  }
};
