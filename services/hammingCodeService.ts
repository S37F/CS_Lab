
// Calculate how many parity bits are needed
const calculateParityBits = (m: number): number => {
    for (let r = 0; r < m; r++) {
        if (Math.pow(2, r) >= m + r + 1) {
            return r;
        }
    }
    return 0;
};

export const generateHammingCode = (dataword: string) => {
    const m = dataword.length;
    const r = calculateParityBits(m);
    const n = m + r;
    const codeword = new Array(n).fill(0);
    const parityBits: number[] = [];

    // Place data bits and identify parity bit positions
    let dataIndex = m - 1;
    for (let i = 0; i < n; i++) {
        const pos = i + 1;
        if ((pos & (pos - 1)) === 0) { // is power of 2
            parityBits.push(pos);
        } else {
            codeword[i] = parseInt(dataword[dataIndex--], 10);
        }
    }

    // Calculate parity bits
    for (const p of parityBits) {
        let oneCount = 0;
        for (let i = 0; i < n; i++) {
            const pos = i + 1;
            if (pos !== p && (pos & p) !== 0) {
                if (codeword[i] === 1) {
                    oneCount++;
                }
            }
        }
        if (oneCount % 2 !== 0) {
            codeword[p - 1] = 1;
        }
    }

    return {
        codeword: codeword.join(''),
        parityBits,
        m,
        r
    };
};

export const checkHammingCode = (received: string, r: number) => {
    const n = received.length;
    const codeword = received.split('').map(Number);
    let syndrome = '';

    // Recalculate parity for each parity bit position
    for (let i = 0; i < r; i++) {
        const p = Math.pow(2, i);
        let oneCount = 0;
        for (let j = 0; j < n; j++) {
            const pos = j + 1;
            if ((pos & p) !== 0) {
                if (codeword[j] === 1) {
                    oneCount++;
                }
            }
        }
        syndrome = (oneCount % 2) + syndrome;
    }
    
    const errorPosition = parseInt(syndrome, 2);
    let corrected = [...codeword];
    if (errorPosition !== 0) {
        corrected[errorPosition - 1] = corrected[errorPosition - 1] === 0 ? 1 : 0;
    }
    
    return {
        syndrome,
        errorPosition,
        corrected: corrected.join(''),
    };
};
