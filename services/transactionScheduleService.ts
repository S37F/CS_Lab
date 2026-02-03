interface Operation {
    type: 'R' | 'W' | 'C' | 'A';
    transaction: number;
    dataItem?: string;
    index: number;
}

const parseSchedule = (scheduleString: string): Operation[] => {
    const operations: Operation[] = [];
    const opRegex = /([RWCA])(\d+)(?:\(([^)]+)\))?/g;
    let match;
    let index = 0;
    while ((match = opRegex.exec(scheduleString)) !== null) {
        operations.push({
            type: match[1] as 'R' | 'W' | 'C' | 'A',
            transaction: parseInt(match[2]),
            dataItem: match[3],
            index: index++
        });
    }
    return operations;
};

export const analyzeScheduleProperties = (scheduleString: string) => {
    const ops = parseSchedule(scheduleString);
    let isRecoverable = true;
    let isCascadeless = true;
    const violations: string[] = [];

    for (let i = 0; i < ops.length; i++) {
        const op_j = ops[i];
        if (op_j.type !== 'R') continue; // We only care about reads

        for (let j = 0; j < i; j++) {
            const op_i = ops[j];
            if (op_i.type !== 'W' || op_i.transaction === op_j.transaction || op_i.dataItem !== op_j.dataItem) {
                continue;
            }

            // At this point, T_j reads from T_i (op_j reads what op_i wrote)
            const commit_i = ops.find(op => op.transaction === op_i.transaction && (op.type === 'C' || op.type === 'A'));
            const commit_j = ops.find(op => op.transaction === op_j.transaction && (op.type === 'C' || op.type === 'A'));

            if (commit_j && commit_i && commit_j.index < commit_i.index) {
                isRecoverable = false;
                violations.push(`Recoverability Violation: T${op_j.transaction} commits before T${op_i.transaction}, but reads its data.`);
            }
            
            if (commit_i && op_j.index < commit_i.index) {
                isCascadeless = false;
                 violations.push(`Cascadeless Violation: T${op_j.transaction} reads from T${op_i.transaction} before T${op_i.transaction} has committed.`);
            }
        }
    }

    if (violations.length === 0) {
        violations.push("Schedule appears to be recoverable and cascadeless.");
    }

    return {
        recoverable: isRecoverable,
        cascadeless: isCascadeless,
        violations
    };
};
