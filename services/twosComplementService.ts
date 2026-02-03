
export const getTwosComplementSteps = (num: number, bits: number): { steps: string[]; result: string; error: string } => {
    const steps: string[] = [];
    let error = '';
    const min = -Math.pow(2, bits - 1);
    const max = Math.pow(2, bits - 1) - 1;

    if (num < min || num > max) {
        error = `With ${bits} bits, the representable range is from ${min} to ${max}.`;
        return { steps: [], result: '', error };
    }

    if (num >= 0) {
        const binary = num.toString(2).padStart(bits, '0');
        steps.push(`1. Number is positive. Convert ${num} to binary.`);
        steps.push(`   Result: <strong>${binary}</strong>`);
        return { steps, result: binary, error: '' };
    }

    // Handle negative numbers
    const absValue = Math.abs(num);
    steps.push(`1. Input is negative (${num}). Take absolute value: ${absValue}.`);

    const binaryAbs = absValue.toString(2).padStart(bits, '0');
    steps.push(`2. Convert ${absValue} to ${bits}-bit binary.`);
    steps.push(`   Binary: ${binaryAbs}`);

    const inverted = binaryAbs.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
    steps.push(`3. Invert all bits (One's Complement).`);
    steps.push(`   Inverted: ${inverted}`);
    
    const resultNum = parseInt(inverted, 2) + 1;
    const resultBinary = resultNum.toString(2).padStart(bits, '0');
    // Handle overflow for the largest negative number case
    const finalResult = resultBinary.length > bits ? resultBinary.slice(-bits) : resultBinary;

    steps.push(`4. Add 1 to the inverted value.`);
    steps.push(`   Result: <strong>${finalResult}</strong>`);

    return { steps, result: finalResult, error: '' };
};
