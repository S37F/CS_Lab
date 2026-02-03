
export const getSignedMagnitude = (num: number, bits: number): { result: { binary: string; sign: string; magnitude: string; range: string; } | null; error: string } => {
    const max = Math.pow(2, bits - 1) - 1;
    const min = -max;

    if (num < min || num > max) {
        return { 
            result: null, 
            error: `With ${bits} bits, the range is from ${min} to ${max}.` 
        };
    }

    const signBit = num < 0 ? '1' : '0';
    const magnitude = Math.abs(num).toString(2).padStart(bits - 1, '0');

    if (magnitude.length > bits - 1) {
         return { 
            result: null, 
            error: `The magnitude of ${num} requires more than ${bits-1} bits.` 
        };
    }

    return {
        result: {
            binary: signBit + magnitude,
            sign: signBit,
            magnitude: magnitude,
            range: `[${min}, ${max}]`
        },
        error: ''
    };
};
