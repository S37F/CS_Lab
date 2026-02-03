import type { DFA } from '../types';

export const simulateDfa = (dfa: DFA, inputString: string): { accepted: boolean; steps: { state: string, input: string }[] } => {
    const steps: { state: string, input: string }[] = [];
    let currentState = dfa.startState;
    let remainingInput = inputString;

    steps.push({ state: currentState, input: remainingInput });

    for (let i = 0; i < inputString.length; i++) {
        const symbol = inputString[i];
        if (!dfa.alphabet.includes(symbol)) {
            // Invalid symbol, reject immediately
            steps.push({ state: currentState, input: '... (invalid symbol)' });
            return { accepted: false, steps };
        }
        
        currentState = dfa.transitions[currentState][symbol];
        remainingInput = inputString.substring(i + 1);
        steps.push({ state: currentState, input: remainingInput });
    }

    const accepted = dfa.acceptStates.includes(currentState);
    return { accepted, steps };
};
