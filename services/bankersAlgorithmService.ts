import type { BankerProcessInfo } from '../types';

export const getBankerSimulation = (available: number[], processes: BankerProcessInfo[]) => {
    const numProcesses = processes.length;
    const numResources = available.length;
    const steps: string[] = [];

    let work = [...available];
    const finish = new Array(numProcesses).fill(false);
    const safeSequence: number[] = [];
    
    steps.push(`Initial state:`);
    steps.push(`  Available = [${available.join(', ')}]`);
    steps.push(`  Work = [${work.join(', ')}]`);
    steps.push(`  Finish = [${finish.join(', ')}]`);

    let possible = true;
    while (possible) {
        possible = false;
        for (let i = 0; i < numProcesses; i++) {
            if (!finish[i]) {
                steps.push(`\nChecking P${i}:`);
                steps.push(`  Need = [${processes[i].need.join(', ')}]`);
                
                const canAllocate = processes[i].need.every((need, resIndex) => need <= work[resIndex]);

                if (canAllocate) {
                    steps.push(`  Need <= Work. P${i} can execute.`);
                    work = work.map((w, resIndex) => w + processes[i].allocation[resIndex]);
                    finish[i] = true;
                    safeSequence.push(i);
                    possible = true;

                    steps.push(`  P${i} finishes. Releases resources.`);
                    steps.push(`  New Work = Work + Allocation = [${work.join(', ')}]`);
                    steps.push(`  Finish = [${finish.join(', ')}]`);
                    break; // Restart search
                } else {
                    steps.push(`  Need > Work. P${i} must wait.`);
                }
            }
        }
    }

    const isSafe = finish.every(f => f === true);
    if (isSafe) {
        steps.push(`\nAll processes finished. System is in a safe state.`);
        steps.push(`Safe Sequence: <${safeSequence.map(p => `P${p}`).join(', ')}>`);
    } else {
        steps.push(`\nCould not find a next process to execute. System is in an unsafe state.`);
    }

    return {
        isSafe,
        safeSequence,
        steps
    };
};