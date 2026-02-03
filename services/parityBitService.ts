
export const calculateParity = (data: string, type: 'even' | 'odd'): { onesCount: number; parityBit: '0' | '1' } => {
    const onesCount = (data.match(/1/g) || []).length;
    let parityBit: '0' | '1' = '0';

    if (type === 'even') {
        if (onesCount % 2 !== 0) {
            parityBit = '1';
        }
    } else { // odd parity
        if (onesCount % 2 === 0) {
            parityBit = '1';
        }
    }
    return { onesCount, parityBit };
};

export const checkParity = (dataWithParity: string, type: 'even' | 'odd'): { pass: boolean; message: string } => {
    const onesCount = (dataWithParity.match(/1/g) || []).length;

    if (type === 'even') {
        if (onesCount % 2 === 0) {
            return { pass: true, message: `Total number of ones (${onesCount}) is even. Data is likely correct.` };
        } else {
            return { pass: false, message: `Total number of ones (${onesCount}) is odd. Data has been corrupted.` };
        }
    } else { // odd parity
        if (onesCount % 2 !== 0) {
            return { pass: true, message: `Total number of ones (${onesCount}) is odd. Data is likely correct.` };
        } else {
            return { pass: false, message: `Total number of ones (${onesCount}) is even. Data has been corrupted.` };
        }
    }
};
