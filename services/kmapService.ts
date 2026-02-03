

const getVars = (numVars: number) => Array.from({ length: numVars }, (_, i) => String.fromCharCode(65 + i));

const termToString = (term: string): string => {
    const vars = getVars(term.length);
    let result = '';
    for (let i = 0; i < term.length; i++) {
        if (term[i] === '1') result += vars[i];
        if (term[i] === '0') result += vars[i] + "'";
    }
    return result || '1';
};

const findPrimeImplicants = (minterms: number[], numVars: number): { term: string, cells: number[] }[] => {
    if (minterms.length === 0) return [];
    
    let groups: { [key: number]: { term: string; minterms: number[]; combined: boolean }[] } = {};
    minterms.forEach(m => {
        const bin = m.toString(2).padStart(numVars, '0');
        const ones = (bin.match(/1/g) || []).length;
        if (!groups[ones]) groups[ones] = [];
        groups[ones].push({ term: bin, minterms: [m], combined: false });
    });

    const primeImplicants: { term: string, cells: number[] }[] = [];
    
    while(Object.keys(groups).length > 0){
        const nextGroups: typeof groups = {};
        const groupKeys = Object.keys(groups).map(Number).sort((a,b)=>a-b);

        for (let i = 0; i < groupKeys.length; i++) {
            const currentGroupKey = groupKeys[i];
            const nextGroupKey = groupKeys.find(k => k === currentGroupKey + 1);
            
            if (nextGroupKey !== undefined) {
                const g1 = groups[currentGroupKey];
                const g2 = groups[nextGroupKey];
                
                for (const t1 of g1) {
                    for (const t2 of g2) {
                        let diff = 0;
                        let diffIndex = -1;
                        for (let k = 0; k < numVars; k++) {
                            if (t1.term[k] !== t2.term[k]) {
                                diff++;
                                diffIndex = k;
                            }
                        }
                        
                        if (diff === 1) {
                            t1.combined = true;
                            t2.combined = true;
                            let newTerm = t1.term.slice(0, diffIndex) + '-' + t1.term.slice(diffIndex + 1);
                            const newMinterms = [...t1.minterms, ...t2.minterms].sort((a, b) => a - b);
                            const ones = (newTerm.match(/1/g) || []).length;
                            
                            if (!nextGroups[ones]) nextGroups[ones] = [];
                            if (!nextGroups[ones].some(t => t.term === newTerm)) {
                                nextGroups[ones].push({ term: newTerm, minterms: newMinterms, combined: false });
                            }
                        }
                    }
                }
            }
        }
        
        groupKeys.forEach(key => {
            groups[key].forEach(term => {
                if (!term.combined) {
                    primeImplicants.push({ term: term.term, cells: term.minterms });
                }
            });
        });

        groups = nextGroups;
    }
    return primeImplicants;
}


// Main solver function
export const solveKmap = (numVars: 2 | 3 | 4, minterms: number[]) => {
    if (minterms.length === 0) return { expression: '0', groups: [] };
    if (minterms.length === Math.pow(2, numVars)) return { expression: '1', groups: [] };

    const primeImplicants = findPrimeImplicants(minterms, numVars);

    // Essential Prime Implicants and chart covering
    const mintermCoverage: { [key: number]: string[] } = {};
    minterms.forEach(m => mintermCoverage[m] = []);
    primeImplicants.forEach(pi => {
        pi.cells.forEach(cell => {
            if (mintermCoverage[cell] !== undefined) {
                mintermCoverage[cell].push(pi.term);
            }
        });
    });

    const essentialPIs = new Set<string>();
    Object.values(mintermCoverage).forEach(covers => {
        if (covers.length === 1) {
            essentialPIs.add(covers[0]);
        }
    });

    let coveredMinterms = new Set<number>();
    essentialPIs.forEach(term => {
        const pi = primeImplicants.find(p => p.term === term);
        pi?.cells.forEach(cell => coveredMinterms.add(cell));
    });

    const finalTerms = new Set(essentialPIs);
    let remainingMinterms = minterms.filter(m => !coveredMinterms.has(m));
    let remainingPIs = primeImplicants.filter(p => !essentialPIs.has(p.term));
    
    // Greedy cover for remaining minterms
    while(remainingMinterms.length > 0 && remainingPIs.length > 0) {
        remainingPIs.sort((a,b) => {
            const coverCountA = a.cells.filter(c => remainingMinterms.includes(c)).length;
            const coverCountB = b.cells.filter(c => remainingMinterms.includes(c)).length;
            // Tie-break by choosing smaller term
            if (coverCountB === coverCountA) {
                 const dashesA = (a.term.match(/-/g) || []).length;
                 const dashesB = (b.term.match(/-/g) || []).length;
                 return dashesB - dashesA;
            }
            return coverCountB - coverCountA;
        });

        const bestPI = remainingPIs.shift(); // Always remove the best PI
        if (!bestPI) break;

        finalTerms.add(bestPI.term);
        bestPI.cells.forEach(cell => {
             const index = remainingMinterms.indexOf(cell);
             if (index > -1) {
                remainingMinterms.splice(index, 1);
             }
        });
    }
    
    const finalGroups = primeImplicants.filter(p => finalTerms.has(p.term));
    const expression = finalGroups.map(p => termToString(p.term)).join(' + ');

    return { expression, groups: finalGroups };
};
