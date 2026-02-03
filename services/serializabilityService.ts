
import type { TransactionOperation } from '../types';

// Parses a schedule string like "R1(A); W2(B)" into an array of operations.
const parseSchedule = (scheduleString: string): TransactionOperation[] => {
    const operations: TransactionOperation[] = [];
    const opRegex = /([RW])(\d+)\(([^)]+)\)/g;
    let match;
    let idCounter = 0;
    while ((match = opRegex.exec(scheduleString)) !== null) {
        operations.push({
            id: idCounter++,
            operation: match[1] as 'R' | 'W',
            transaction: parseInt(match[2]),
            dataItem: match[3]
        });
    }
    return operations;
};

export const analyzeSerializability = (scheduleString: string) => {
    const operations = parseSchedule(scheduleString);
    const transactions = Array.from(new Set(operations.map(op => op.transaction))).sort((a, b) => a - b);
    const transactionNodes = transactions.map(t => `T${t}`);

    const conflicts: string[] = [];
    const edges: [string, string][] = [];
    const edgeSet = new Set<string>();

    for (let i = 0; i < operations.length; i++) {
        for (let j = i + 1; j < operations.length; j++) {
            const op1 = operations[i];
            const op2 = operations[j];

            // Check for conflict conditions
            if (op1.transaction !== op2.transaction && op1.dataItem === op2.dataItem) {
                if (op1.operation === 'W' || op2.operation === 'W') {
                    const fromNode = `T${op1.transaction}`;
                    const toNode = `T${op2.transaction}`;
                    
                    const edgeKey = `${fromNode}->${toNode}`;
                    if (!edgeSet.has(edgeKey)) {
                         conflicts.push(`(${op1.operation}${op1.transaction}(${op1.dataItem}), ${op2.operation}${op2.transaction}(${op2.dataItem}))`);
                        edges.push([fromNode, toNode]);
                        edgeSet.add(edgeKey);
                    }
                }
            }
        }
    }

    // Cycle detection in graph (using DFS)
    const adj: { [key: string]: string[] } = {};
    transactionNodes.forEach(node => adj[node] = []);
    edges.forEach(([u, v]) => adj[u].push(v));

    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    let cycle: string[] | null = null;

    function detectCycleUtil(u: string, path: string[]): boolean {
        visited.add(u);
        recursionStack.add(u);
        path.push(u);

        for (const v of (adj[u] || [])) {
            if (!visited.has(v)) {
                if (detectCycleUtil(v, path)) return true;
            } else if (recursionStack.has(v)) {
                // Cycle detected
                cycle = [...path.slice(path.indexOf(v)), v];
                return true;
            }
        }
        recursionStack.delete(u);
        path.pop();
        return false;
    }

    for (const node of transactionNodes) {
        if (!visited.has(node)) {
            if (detectCycleUtil(node, [])) {
                break;
            }
        }
    }

    return {
        isSerializable: cycle === null,
        conflicts,
        graph: { nodes: transactionNodes, edges },
        cycle
    };
};
