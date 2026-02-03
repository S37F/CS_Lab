
export const getIeee754Steps = (num: number, precision: 'single' | 'double'): { steps: string[]; result: { sign: string; exponent: string; mantissa: string; } | null; error: string } => {
    const steps: string[] = [];
    let error = '';

    const exponentBits = precision === 'single' ? 8 : 11;
    const mantissaBits = precision === 'single' ? 23 : 52;
    const bias = Math.pow(2, exponentBits - 1) - 1;

    // Step 1: Sign Bit
    const signBit = num < 0 ? '1' : '0';
    steps.push(`1. <strong>Sign Bit</strong>: The number is ${num >= 0 ? 'positive' : 'negative'}, so the sign bit is <strong>${signBit}</strong>.`);

    const absNum = Math.abs(num);

    // Handle special cases
    if (absNum === 0) {
        const exponent = ''.padStart(exponentBits, '0');
        const mantissa = ''.padStart(mantissaBits, '0');
        steps.push(`2. Handle special case: Zero. Exponent and Mantissa are all zeros.`);
        return { steps, result: { sign: signBit, exponent, mantissa }, error: '' };
    }
    if (!isFinite(absNum)) {
        const exponent = ''.padStart(exponentBits, '1');
        const mantissa = ''.padStart(mantissaBits, '0');
        steps.push(`2. Handle special case: Infinity. Exponent is all ones, Mantissa is all zeros.`);
        return { steps, result: { sign: signBit, exponent, mantissa }, error: '' };
    }

    // Step 2: Convert to Binary
    let intPart = Math.floor(absNum);
    let fracPart = absNum - intPart;
    let intBinary = intPart.toString(2);
    steps.push(`2. <strong>Binary Conversion</strong>: Convert absolute value ${absNum} to binary.`);
    steps.push(`   - Integer part (${intPart}): ${intBinary}`);

    let fracBinary = '';
    while (fracPart > 0 && fracBinary.length < mantissaBits + 5) { // Add extra precision
        fracPart *= 2;
        if (fracPart >= 1) {
            fracBinary += '1';
            fracPart -= 1;
        } else {
            fracBinary += '0';
        }
    }
    steps.push(`   - Fractional part (${absNum - intPart}): .${fracBinary}`);
    const fullBinary = `${intBinary}.${fracBinary}`;
    steps.push(`   - Combined: ${fullBinary}`);

    // Step 3: Normalize
    let exponent = 0;
    let normalizedMantissa = '';

    if (intPart > 0) {
        exponent = intBinary.length - 1;
        normalizedMantissa = (intBinary.substring(1) + fracBinary);
    } else {
        const firstOne = fracBinary.indexOf('1');
        exponent = -(firstOne + 1);
        normalizedMantissa = fracBinary.substring(firstOne + 1);
    }
    steps.push(`3. <strong>Normalize</strong>: Move the decimal point to get 1.xxxxx format.`);
    steps.push(`   - Normalized form: 1.${normalizedMantissa} x 2^${exponent}`);
    
    // Step 4: Calculate Biased Exponent
    const biasedExponent = exponent + bias;
    const exponentBinary = biasedExponent.toString(2).padStart(exponentBits, '0');
    steps.push(`4. <strong>Exponent Calculation</strong>: Add bias (${bias}) to the exponent (${exponent}).`);
    steps.push(`   - Biased Exponent: ${exponent} + ${bias} = ${biasedExponent}`);
    steps.push(`   - As ${exponentBits}-bit binary: <strong>${exponentBinary}</strong>`);

    // Step 5: Mantissa
    const finalMantissa = normalizedMantissa.padEnd(mantissaBits, '0').substring(0, mantissaBits);
    steps.push(`5. <strong>Mantissa</strong>: Take the fractional part of the normalized form, padded to ${mantissaBits} bits.`);
    steps.push(`   - Mantissa: <strong>${finalMantissa}</strong>`);

    const result = {
        sign: signBit,
        exponent: exponentBinary,
        mantissa: finalMantissa
    };
    
    return { steps, result, error };
};
