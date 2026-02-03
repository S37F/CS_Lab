
export const calculateChecksum = (hexWords: string[], wordSize: 16): { checksum: string; steps: string[] } => {
    const steps: string[] = [];
    let sum = 0;

    steps.push("1. Sum all 16-bit words:");
    
    hexWords.forEach(word => {
        const value = parseInt(word, 16);
        steps.push(`   ${sum.toString(16).padStart(4, '0')} + ${word} = ${(sum + value).toString(16).padStart(4, '0')}`);
        sum += value;
    });

    steps.push("\n2. Handle carries (end-around carry):");
    while (sum > 0xFFFF) {
        const carry = sum >> 16;
        const main = sum & 0xFFFF;
        steps.push(`   Carry detected: 0x${sum.toString(16)} -> 0x${main.toString(16)} + 0x${carry.toString(16)}`);
        sum = main + carry;
        steps.push(`   New sum: 0x${sum.toString(16).padStart(4, '0')}`);
    }
    
    steps.push(`\nFinal sum: 0x${sum.toString(16).padStart(4, '0')}`);

    steps.push("\n3. Take one's complement (invert bits):");
    const checksum = (~sum) & 0xFFFF;
    steps.push(`   ~${sum.toString(16).padStart(4, '0')} = ${checksum.toString(16).padStart(4, '0')}`);

    steps.push(`\nChecksum: 0x${checksum.toString(16).padStart(4, '0').toUpperCase()}`);

    return {
        checksum: checksum.toString(16).padStart(4, '0').toUpperCase(),
        steps
    };
};
