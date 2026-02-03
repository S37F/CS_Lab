export interface Algorithm {
  name: string;
  category: string;
}

export interface AlgorithmStep {
  id: number;
  description: string;
  state: any;
  metrics: any;
  educational_notes: string[];
}

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  color?: string;
  remainingTime?: number;
}

export interface GraphNode {
    id: string;
    x: number;
    y: number;
}
  
export interface GraphEdge {
    source: string;
    target: string;
    weight: number;
}

export interface HuffmanNode {
    char: string;
    freq: number;
    id: string;
    left?: HuffmanNode;
    right?: HuffmanNode;
}

export interface AlgorithmSimulation {
  success: boolean;
  result: any;
  steps: AlgorithmStep[];
  metadata: {
    execution_time_ms: number;
    memory_usage_mb: number;
    complexity?: {
      time: string;
      space: string;
    };
  };
}

export interface DiskRequest {
    id: number;
    cylinder: number;
}

export interface FunctionalDependency {
    determinant: string[];
    dependent: string[];
}

export interface TransactionOperation {
    id: number;
    transaction: number;
    operation: 'R' | 'W';
    dataItem: string;
}

export interface DfaStateTransitions {
    [key: string]: string;
}

export interface DFA {
    states: string[];
    alphabet: string[];
    transitions: Record<string, DfaStateTransitions>;
    startState: string;
    acceptStates: string[];
}

export interface BankerProcessInfo {
    id: number;
    allocation: number[];
    max: number[];
    need: number[];
}