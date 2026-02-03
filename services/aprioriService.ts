
// This file will contain the simulation logic for the Apriori algorithm.
// Due to the complexity of a full implementation for all algorithms at once,
// this service is provided as a placeholder to be completed.
export const runApriori = () => {
    return { steps: [], error: "Simulator not yet implemented." };
};

import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export const getAprioriSimulation = (transactions: string[][], minSupport: number): AlgorithmSimulation => {
    const steps: AlgorithmStep[] = [];
    const totalTransactions = transactions.length;
    const minSupportCount = Math.ceil(minSupport * totalTransactions);
    
    // Count item frequencies
    const itemCounts = new Map<string, number>();
    transactions.forEach(transaction => {
        transaction.forEach(item => {
            itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
        });
    });

    // Find frequent 1-itemsets (L1)
    const l1: Array<{items: string[], support: number}> = [];
    const supports = new Map<string, number>();
    
    itemCounts.forEach((count, item) => {
        const support = count / totalTransactions;
        if (count >= minSupportCount) {
            l1.push({ items: [item], support });
            supports.set(JSON.stringify([item].sort()), support);
        }
    });

    steps.push({
        description: `Scanning database to find frequent 1-itemsets. Found ${l1.length} items that meet minimum support of ${(minSupport * 100).toFixed(0)}%`,
        state: {
            currentLevel: 1,
            currentCandidates: l1.map(i => i.items),
            frequentItemsets: l1,
            supports: Object.fromEntries(supports),
            totalTransactions,
            minSupportCount
        },
        metrics: {}
    });

    let currentL = l1;
    let level = 2;
    const allFrequentItemsets = [...l1];

    // Generate higher level itemsets
    while (currentL.length > 0 && level <= 4) { // Limit to 4-itemsets for visualization
        // Generate candidates
        const candidates: string[][] = [];
        for (let i = 0; i < currentL.length; i++) {
            for (let j = i + 1; j < currentL.length; j++) {
                const union = Array.from(new Set([...currentL[i].items, ...currentL[j].items])).sort();
                if (union.length === level && !candidates.some(c => JSON.stringify(c) === JSON.stringify(union))) {
                    candidates.push(union);
                }
            }
        }

        if (candidates.length === 0) break;

        steps.push({
            description: `Generated ${candidates.length} candidate ${level}-itemsets by joining L${level-1}`,
            state: {
                currentLevel: level,
                currentCandidates: candidates,
                frequentItemsets: allFrequentItemsets,
                supports: Object.fromEntries(supports),
                totalTransactions,
                minSupportCount
            },
            metrics: {}
        });

        // Count support for candidates
        const candidateSupports = new Map<string, number>();
        candidates.forEach(candidate => {
            let count = 0;
            transactions.forEach(transaction => {
                if (candidate.every(item => transaction.includes(item))) {
                    count++;
                }
            });
            candidateSupports.set(JSON.stringify(candidate.sort()), count / totalTransactions);
        });

        // Filter frequent itemsets
        const lk: Array<{items: string[], support: number}> = [];
        candidateSupports.forEach((support, key) => {
            const items = JSON.parse(key);
            if (support >= minSupport) {
                lk.push({ items, support });
                supports.set(key, support);
                allFrequentItemsets.push({ items, support });
            }
        });

        steps.push({
            description: `Found ${lk.length} frequent ${level}-itemsets after scanning transactions`,
            state: {
                currentLevel: level,
                currentCandidates: candidates,
                frequentItemsets: allFrequentItemsets,
                supports: Object.fromEntries(supports),
                totalTransactions,
                minSupportCount
            },
            metrics: {}
        });

        currentL = lk;
        level++;
    }

    steps.push({
        description: `Algorithm complete. Found ${allFrequentItemsets.length} total frequent itemsets`,
        state: {
            currentLevel: level - 1,
            currentCandidates: [],
            frequentItemsets: allFrequentItemsets,
            supports: Object.fromEntries(supports),
            totalTransactions,
            minSupportCount
        },
        metrics: {}
    });

    return {
        steps,
        title: 'Apriori Algorithm',
        description: 'Finding frequent itemsets using the Apriori algorithm'
    };
};
