
export const calculateCrc = (dataBits: string, generator: string): { remainder: string; transmitted: string; steps: string[] } => {
    const steps: string[] = [];
    const n = dataBits.length;
    const r = generator.length - 1;

    // 1. Append r zeros to the data
    let dividend = dataBits + '0'.repeat(r);
    steps.push(`1. Append ${r} zeros to data:`);
    steps.push(`   Data:      ${dataBits}`);
    steps.push(`   Augmented: ${dividend}`);
    steps.push(`   Generator: ${generator}`);
    steps.push('-'.repeat(dividend.length + 2));

    let remainder = dividend.slice(0, generator.length);
    steps.push(`${' '.repeat(generator.length-1)} ${dividend}`);

    for (let i = 0; i < n; i++) {
        steps.push(`${' '.repeat(i)} ${'-'.repeat(generator.length)}`);
        
        if (remainder[0] === '1') {
            steps.push(`${' '.repeat(i)} ${generator}`);
            
            let newRemainder = '';
            for (let j = 0; j < generator.length; j++) {
                newRemainder += (remainder[j] === generator[j] ? '0' : '1');
            }
            remainder = newRemainder.slice(1) + (dividend[i + generator.length] || '');
            steps.push(`${' '.repeat(i)} ${'-'.repeat(generator.length)}`);
            steps.push(`${' '.repeat(i+1)} ${remainder.slice(0, generator.length - 1)}`);

        } else {
             steps.push(`${' '.repeat(i)} ${'0'.repeat(generator.length)}`);
             remainder = remainder.slice(1) + (dividend[i + generator.length] || '');
             steps.push(`${' '.repeat(i)} ${'-'.repeat(generator.length)}`);
             steps.push(`${' '.repeat(i+1)} ${remainder.slice(0, generator.length-1)}`);
        }
    }
    
    const finalRemainder = remainder.slice(0, r);
    steps.push(`\nFinal remainder (CRC): ${finalRemainder}`);
    
    const transmittedData = dataBits + finalRemainder;
    steps.push(`Transmitted Data (Data + CRC): ${transmittedData}`);

    return {
        remainder: finalRemainder,
        transmitted: transmittedData,
        steps
    };
};
