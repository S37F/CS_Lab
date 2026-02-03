
export const dfaAcceptanceCode = {
  'Python': `def dfa_accepts(dfa, input_string):
    """
    Simulates a DFA and checks if it accepts the input string.
    
    dfa = {
        'states': {'q0', 'q1', 'q2'},
        'alphabet': {'0', '1'},
        'transitions': {
            'q0': {'0': 'q1', '1': 'q0'},
            'q1': {'0': 'q1', '1': 'q2'},
            'q2': {'0': 'q1', '1': 'q0'}
        },
        'start_state': 'q0',
        'accept_states': {'q2'}
    }
    """
    current_state = dfa['start_state']
    
    for symbol in input_string:
        if symbol not in dfa['alphabet']:
            return False # Symbol not in alphabet
        current_state = dfa['transitions'][current_state][symbol]
        
    return current_state in dfa['accept_states']

# Example DFA that accepts strings ending in "01"
dfa_config = {
    'states': {'q0', 'q1', 'q2'},
    'alphabet': {'0', '1'},
    'transitions': {
        'q0': {'0': 'q1', '1': 'q0'},
        'q1': {'0': 'q1', '1': 'q2'},
        'q2': {'0': 'q1', '1': 'q0'}
    },
    'start_state': 'q0',
    'accept_states': {'q2'}
}

test_string1 = "1101"
test_string2 = "010"

print(f"'{test_string1}' is accepted: {dfa_accepts(dfa_config, test_string1)}") # True
print(f"'{test_string2}' is accepted: {dfa_accepts(dfa_config, test_string2)}") # False
`,
  'Java': `import java.util.Map;
import java.util.Set;

public class DFA {
    private Set<String> states;
    private Set<Character> alphabet;
    private Map<String, Map<Character, String>> transitions;
    private String startState;
    private Set<String> acceptStates;

    public DFA(Set<String> states, Set<Character> alphabet, Map<String, Map<Character, String>> transitions, String startState, Set<String> acceptStates) {
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
        this.startState = startState;
        this.acceptStates = acceptStates;
    }

    public boolean accepts(String inputString) {
        String currentState = startState;
        for (char symbol : inputString.toCharArray()) {
            if (!alphabet.contains(symbol)) {
                return false; // Invalid symbol
            }
            currentState = transitions.get(currentState).get(symbol);
        }
        return acceptStates.contains(currentState);
    }

    public static void main(String[] args) {
        // DFA that accepts strings ending in "01"
        DFA dfa = new DFA(
            Set.of("q0", "q1", "q2"),
            Set.of('0', '1'),
            Map.of(
                "q0", Map.of('0', "q1", '1', "q0"),
                "q1", Map.of('0', "q1", '1', "q2"),
                "q2", Map.of('0', "q1", '1', "q0")
            ),
            "q0",
            Set.of("q2")
        );
        
        System.out.println("'1101' is accepted: " + dfa.accepts("1101")); // true
        System.out.println("'010' is accepted: " + dfa.accepts("010"));   // false
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <vector>
#include <set>
#include <map>

class DFA {
private:
    std::set<std::string> states;
    std::set<char> alphabet;
    std::map<std::string, std::map<char, std::string>> transitions;
    std::string startState;
    std::set<std::string> acceptStates;

public:
    DFA(std::set<std::string> s, std::set<char> a, 
        std::map<std::string, std::map<char, std::string>> t, 
        std::string ss, std::set<std::string> as)
        : states(s), alphabet(a), transitions(t), startState(ss), acceptStates(as) {}

    bool accepts(const std::string& inputString) {
        std::string currentState = startState;
        for (char symbol : inputString) {
            if (alphabet.find(symbol) == alphabet.end()) {
                return false; // Invalid symbol
            }
            currentState = transitions[currentState][symbol];
        }
        return acceptStates.count(currentState) > 0;
    }
};

int main() {
    // DFA that accepts strings ending in "01"
    DFA dfa(
        {"q0", "q1", "q2"},
        {'0', '1'},
        {
            {"q0", {{'0', "q1"}, {'1', "q0"}}},
            {"q1", {{'0', "q1"}, {'1', "q2"}}},
            {"q2", {{'0', "q1"}, {'1', "q0"}}}
        },
        "q0",
        {"q2"}
    );

    std::cout << "'1101' is accepted: " << std::boolalpha << dfa.accepts("1101") << std::endl;
    std::cout << "'010' is accepted: " << std::boolalpha << dfa.accepts("010") << std::endl;

    return 0;
}
`
};
