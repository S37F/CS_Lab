
export const regexToDfaCode = {
  'Python': `import re

# NOTE: This is a conceptual demonstration.
# A full regex to DFA conversion involves creating an NFA first (Thompson's construction)
# and then converting the NFA to a DFA (subset construction).
# This is a very complex algorithm.
# Python's 're' engine uses a highly optimized C implementation.

def conceptual_regex_to_dfa_for_ab_star(text):
    """
    This function simulates a DFA for the simple regex 'ab*'.
    States:
    q0: start
    q1: 'a' seen
    q2: 'a' and one or more 'b's seen (accept state)
    q_trap: trap state for invalid sequences
    """
    state = 'q0'
    for char in text:
        if state == 'q0' and char == 'a':
            state = 'q1'
        elif state == 'q1' and char == 'b':
            state = 'q2'
        elif state == 'q2' and char == 'b':
            state = 'q2'
        else:
            state = 'q_trap'
            break
    
    # 'a' is also accepted (b* means zero or more b's)
    return state in ['q1', 'q2']

print(f"Match 'a': {conceptual_regex_to_dfa_for_ab_star('a')}")
print(f"Match 'ab': {conceptual_regex_to_dfa_for_ab_star('ab')}")
print(f"Match 'abbb': {conceptual_regex_to_dfa_for_ab_star('abbb')}")
print(f"Match 'ac': {conceptual_regex_to_dfa_for_ab_star('ac')}")
print(f"Match 'b': {conceptual_regex_to_dfa_for_ab_star('b')}")
`,
  'Java': `// NOTE: A full Regex to DFA implementation is extremely complex.
// The code below simulates a hard-coded DFA for the simple regex "ab*".

public class RegexToDFASimulation {

    enum State {
        Q0_START,
        Q1_A_SEEN,
        Q2_ACCEPT,
        Q_TRAP
    }

    public static boolean matches_ab_star(String text) {
        State currentState = State.Q0_START;

        for (char c : text.toCharArray()) {
            switch (currentState) {
                case Q0_START:
                    if (c == 'a') {
                        currentState = State.Q1_A_SEEN;
                    } else {
                        currentState = State.Q_TRAP;
                    }
                    break;
                case Q1_A_SEEN:
                    if (c == 'b') {
                        currentState = State.Q2_ACCEPT;
                    } else {
                        currentState = State.Q_TRAP;
                    }
                    break;
                case Q2_ACCEPT:
                    if (c != 'b') {
                        currentState = State.Q_TRAP;
                    }
                    break;
                case Q_TRAP:
                    return false; // Already in a trap state
            }
        }
        
        // Q1 is also an accept state (zero 'b's)
        return currentState == State.Q1_A_SEEN || currentState == State.Q2_ACCEPT;
    }

    public static void main(String[] args) {
        System.out.println("Match 'a': " + matches_ab_star("a"));
        System.out.println("Match 'abbb': " + matches_ab_star("abbb"));
        System.out.println("Match 'b': " + matches_ab_star("b"));
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>

// NOTE: A full Regex to DFA implementation is extremely complex.
// The code below simulates a hard-coded DFA for the simple regex "ab*".

enum State {
    Q0_START,
    Q1_A_SEEN,
    Q2_ACCEPT,
    Q_TRAP
};

bool matches_ab_star(const std::string& text) {
    State currentState = Q0_START;

    for (char c : text) {
        switch (currentState) {
            case Q0_START:
                if (c == 'a') currentState = Q1_A_SEEN;
                else currentState = Q_TRAP;
                break;
            case Q1_A_SEEN:
                if (c == 'b') currentState = Q2_ACCEPT;
                else currentState = Q_TRAP;
                break;
            case Q2_ACCEPT:
                if (c != 'b') currentState = Q_TRAP;
                break;
            case Q_TRAP:
                return false;
        }
    }

    return currentState == Q1_A_SEEN || currentState == Q2_ACCEPT;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << "Match 'a': " << matches_ab_star("a") << std::endl;
    std::cout << "Match 'abbb': " << matches_ab_star("abbb") << std::endl;
    std::cout << "Match 'b': " << matches_ab_star("b") << std::endl;
    return 0;
}
`
};
