import type { FunctionalDependency } from '../types';

// Helper functions for set operations
const isSubset = (subset: string[], superset: string[]) => subset.every(item => superset.includes(item));
const setsAreEqual = (set1: string[], set2: string[]) => isSubset(set1, set2) && isSubset(set2, set1);

export const analyzeNormalization = (attributes: string[], primaryKey: string[], fdsString: string): { analysis: string[], error: string } => {
    const analysis: string[] = [];
    let error = '';

    // 1. Parse FDs
    const fds: FunctionalDependency[] = fdsString.split('\n').map(line => {
        const parts = line.split('->');
        if (parts.length !== 2) return null;
        const determinant = parts[0].split(',').map(s => s.trim()).filter(Boolean);
        const dependent = parts[1].split(',').map(s => s.trim()).filter(Boolean);
        return { determinant, dependent };
    }).filter((fd): fd is FunctionalDependency => fd !== null && fd.determinant.length > 0 && fd.dependent.length > 0);

    if (fds.length === 0) {
        error = "No valid functional dependencies provided.";
        return { analysis, error };
    }

    // --- Start Analysis ---
    let highestNormalForm = '1NF';
    analysis.push('<strong>1. First Normal Form (1NF) Check:</strong>');
    analysis.push('✔️ Assuming attributes are atomic. Relation is in 1NF.');

    // --- 2NF Check ---
    analysis.push('\n<strong>2. Second Normal Form (2NF) Check:</strong>');
    let isIn2NF = true;
    const primeAttributes = new Set(primaryKey);
    const nonPrimeAttributes = attributes.filter(attr => !primeAttributes.has(attr));

    if (primaryKey.length > 1) { // 2NF is only relevant for composite keys
        for (const fd of fds) {
            // Check for partial dependency: a proper subset of the PK determines a non-prime attribute
            if (isSubset(fd.determinant, primaryKey) && !setsAreEqual(fd.determinant, primaryKey)) {
                const hasNonPrimeDependent = fd.dependent.some(dep => nonPrimeAttributes.includes(dep));
                if (hasNonPrimeDependent) {
                    analysis.push(`❌ Violation: Partial dependency found. {${fd.determinant.join(', ')}} -> {${fd.dependent.join(', ')}}, where a proper subset of the primary key determines a non-prime attribute.`);
                    isIn2NF = false;
                }
            }
        }
    }

    if (isIn2NF) {
        analysis.push('✔️ No partial dependencies found. Relation is in 2NF.');
        highestNormalForm = '2NF';
    } else {
        analysis.push('Relation is NOT in 2NF.');
        analysis.push(`\nHighest Normal Form: <strong>${highestNormalForm}</strong>`);
        return { analysis, error };
    }

    // --- 3NF Check ---
    analysis.push('\n<strong>3. Third Normal Form (3NF) Check:</strong>');
    let isIn3NF = true;
    for (const fd of fds) {
        const isDeterminantSuperkey = isSubset(primaryKey, fd.determinant); // Simplified: assumes single PK is the only superkey
        const isDependentPrime = fd.dependent.every(dep => primeAttributes.has(dep));

        if (!isDeterminantSuperkey && !isDependentPrime) {
            analysis.push(`❌ Violation: Transitive dependency found. {${fd.determinant.join(', ')}} -> {${fd.dependent.join(', ')}}, where a non-key attribute determines another non-key attribute.`);
            isIn3NF = false;
        }
    }

    if (isIn3NF) {
        analysis.push('✔️ No transitive dependencies found. Relation is in 3NF.');
        highestNormalForm = '3NF';
    } else {
        analysis.push('Relation is NOT in 3NF.');
        analysis.push(`\nHighest Normal Form: <strong>${highestNormalForm}</strong>`);
        return { analysis, error };
    }

    // --- BCNF Check ---
    analysis.push('\n<strong>4. Boyce-Codd Normal Form (BCNF) Check:</strong>');
    let isInBCNF = true;
    for (const fd of fds) {
        // A simple check: if the determinant is not the primary key, it's a violation
        // This is a simplification and assumes the provided PK is the only candidate key.
        if (!setsAreEqual(fd.determinant, primaryKey)) {
            // Check if the determinant is a superkey by calculating its closure
            const closure = new Set(fd.determinant);
            let changed = true;
            while (changed) {
                changed = false;
                fds.forEach(innerFd => {
                    if (isSubset(innerFd.determinant, Array.from(closure))) {
                        innerFd.dependent.forEach(dep => {
                            if (!closure.has(dep)) {
                                closure.add(dep);
                                changed = true;
                            }
                        });
                    }
                });
            }

            if (closure.size !== attributes.length) {
                analysis.push(`❌ Violation: For FD {${fd.determinant.join(', ')}} -> {${fd.dependent.join(', ')}}, the determinant {${fd.determinant.join(', ')}} is not a superkey.`);
                isInBCNF = false;
            }
        }
    }

    if (isInBCNF) {
        analysis.push('✔️ For every dependency, the determinant is a superkey. Relation is in BCNF.');
        highestNormalForm = 'BCNF';
    } else {
        analysis.push('Relation is NOT in BCNF.');
    }
    
    analysis.push(`\nHighest Normal Form: <strong>${highestNormalForm}</strong>`);
    return { analysis, error };
};
