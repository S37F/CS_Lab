
interface Grammar {
    [key: string]: Set<string>;
}

const parseGrammar = (grammarString: string): Grammar => {
    const grammar: Grammar = {};
    const lines = grammarString.split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
        const parts = line.split('->');
        if (parts.length !== 2) throw new Error(`Invalid rule format: ${line}`);
        const variable = parts[0].trim();
        const productions = parts[1].split('|').map(p => p.trim());
        if (!grammar[variable]) {
            grammar[variable] = new Set();
        }
        productions.forEach(p => grammar[variable].add(p));
    }
    return grammar;
};

export const cykParse = (grammarString: string, input: string): { table: string[][]; isAccepted: boolean } => {
    const grammar = parseGrammar(grammarString);
    const n = input.length;
    if (n === 0) return { table: [], isAccepted: grammar['S']?.has('') || false };

    const table: Set<string>[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => new Set()));

    for (let i = 0; i < n; i++) {
        const terminal = input[i];
        for (const variable in grammar) {
            if (grammar[variable].has(terminal)) {
                table[i][i].add(variable);
            }
        }
    }

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            for (let k = i; k < j; k++) {
                for (const variable in grammar) {
                    for (const production of grammar[variable]) {
                        if (production.length === 2) {
                            const [B, C] = [production[0], production[1]];
                            if (table[i][k].has(B) && table[k + 1][j].has(C)) {
                                table[i][j].add(variable);
                            }
                        }
                    }
                }
            }
        }
    }

    const stringTable = table.map(row => row.map(cell => Array.from(cell).join(',')));
    const isAccepted = table[0][n - 1].has('S');

    return { table: stringTable, isAccepted };
};
