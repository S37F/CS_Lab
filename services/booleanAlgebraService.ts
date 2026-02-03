const decToBin = (dec: number, numVars: number) => dec.toString(2).padStart(numVars, '0');
const countOnes = (bin: string) => (bin.match(/1/g) || []).length;

export const simplifyMinterms = (numVars: number, minterms: number[]): { steps: string[], finalExpression: string } => {
    const steps: string[] = [];
    const variables = Array.from({ length: numVars }, (_, i) => String.fromCharCode(65 + i));

    // Step 1: Group minterms by number of ones
    const groups: { [key: number]: { term: string; minterms: number[] }[] } = {};
    minterms.forEach(m => {
        const bin = decToBin(m, numVars);
        const ones = countOnes(bin);
        if (!groups[ones]) groups[ones] = [];
        groups[ones].push({ term: bin, minterms: [m] });
    });

    steps.push("Step 1: Group minterms by number of 1s");
    Object.entries(groups).forEach(([ones, terms]) => {
        steps.push(`  Group ${ones}: ${terms.map(t => t.term).join(', ')}`);
    });

    // Step 2: Combine terms to find prime implicants
    let currentGroups = groups;
    const primeImplicants: { term: string; minterms: number[] }[] = [];
    let combinedInPass;

    steps.push("\nStep 2: Combine adjacent groups");
    do {
        combinedInPass = new Set<string>();
        const nextGroups: typeof groups = {};
        const groupKeys = Object.keys(currentGroups).map(Number).sort((a,b)=>a-b);

        for (let i = 0; i < groupKeys.length - 1; i++) {
            const g1 = currentGroups[groupKeys[i]];
            const g2 = currentGroups[groupKeys[i+1]];

            for (const t1 of g1) {
                for (const t2 of g2) {
                    let diff = 0;
                    let newTerm = '';
                    for (let k = 0; k < numVars; k++) {
                        if (t1.term[k] !== t2.term[k]) {
                            diff++;
                            newTerm += '-';
                        } else {
                            newTerm += t1.term[k];
                        }
                    }

                    if (diff === 1) {
                        const newMinterms = [...t1.minterms, ...t2.minterms].sort((a,b)=>a-b);
                        const ones = countOnes(newTerm.replace(/-/g, ''));
                        if (!nextGroups[ones]) nextGroups[ones] = [];
                        if (!nextGroups[ones].some(t => t.term === newTerm)) {
                           steps.push(`  Combining ${t1.term} & ${t2.term} -> ${newTerm}`);
                           nextGroups[ones].push({ term: newTerm, minterms: newMinterms });
                        }
                        combinedInPass.add(t1.term);
                        combinedInPass.add(t2.term);
                    }
                }
            }
        }
        
        // Add uncombined terms to prime implicants
        groupKeys.forEach(key => {
            currentGroups[key].forEach(term => {
                if (!combinedInPass.has(term.term)) {
                    primeImplicants.push(term);
                }
            });
        });
        currentGroups = nextGroups;
    } while (Object.keys(currentGroups).length > 0);
    
    steps.push("\nStep 3: Identify Prime Implicants (terms that couldn't be combined further)");
    primeImplicants.forEach(pi => steps.push(`  - ${pi.term} (covers ${pi.minterms.join(', ')})`));
    
    // Step 4: Prime Implicant Chart
    steps.push("\nStep 4: Prime Implicant Chart to find essential PIs");
    const coveredMinterms = new Set<number>();
    const essentialPIs: typeof primeImplicants = [];

    minterms.forEach(m => {
        const coveringPIs = primeImplicants.filter(pi => pi.minterms.includes(m));
        if (coveringPIs.length === 1) {
            const essential = coveringPIs[0];
            if (!essentialPIs.some(epi => epi.term === essential.term)) {
                essentialPIs.push(essential);
                steps.push(`  Minterm ${m} is only covered by ${essential.term}. It's an Essential PI.`);
                essential.minterms.forEach(em => coveredMinterms.add(em));
            }
        }
    });

    // Step 5: Cover remaining minterms
    const finalPIs = [...essentialPIs];
    const remainingMinterms = minterms.filter(m => !coveredMinterms.has(m));
    const remainingPIs = primeImplicants.filter(pi => !essentialPIs.some(epi => epi.term === pi.term));

    if (remainingMinterms.length > 0) {
        steps.push(`\nStep 5: Cover remaining minterms: ${remainingMinterms.join(', ')}`);
        // Simple greedy approach for remaining PIs
        while (remainingMinterms.length > 0) {
            remainingPIs.sort((a, b) => b.minterms.filter(m => remainingMinterms.includes(m)).length - a.minterms.filter(m => remainingMinterms.includes(m)).length);
            const bestPI = remainingPIs.shift();
            if (!bestPI) break;
            finalPIs.push(bestPI);
            steps.push(`  Selected PI ${bestPI.term} to cover remaining minterms.`);
            bestPI.minterms.forEach(m => {
                const index = remainingMinterms.indexOf(m);
                if (index > -1) remainingMinterms.splice(index, 1);
            });
        }
    }

    // Step 6: Generate final expression
    const termToString = (term: string) => {
        let str = '';
        for (let i = 0; i < numVars; i++) {
            if (term[i] === '1') str += variables[i];
            if (term[i] === '0') str += variables[i] + "'";
        }
        return str;
    };
    
    const finalExpression = finalPIs.map(pi => termToString(pi.term)).join(' + ');
    steps.push(`\nFinal Expression: ${finalExpression}`);

    return { steps, finalExpression };
};
