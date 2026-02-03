
export const serializabilityCode = {
  'Python': `def parse_schedule(schedule_str):
    import re
    ops = []
    for match in re.finditer(r'([RW])(\\d+)\\(([^)]+)\\)', schedule_str):
        ops.append({'op': match.group(1), 't': int(match.group(2)), 'item': match.group(3)})
    return ops

def check_conflict_serializability(schedule_str):
    operations = parse_schedule(schedule_str)
    transactions = sorted(list(set(op['t'] for op in operations)))
    
    adj = {t: [] for t in transactions}
    
    for i in range(len(operations)):
        for j in range(i + 1, len(operations)):
            op1, op2 = operations[i], operations[j]
            
            if op1['t'] != op2['t'] and op1['item'] == op2['item']:
                if op1['op'] == 'W' or op2['op'] == 'W':
                    if op2['t'] not in adj[op1['t']]:
                         adj[op1['t']].append(op2['t'])

    # Cycle detection using DFS
    path = set()
    visited = set()
    
    def has_cycle(node):
        path.add(node)
        visited.add(node)
        for neighbor in adj.get(node, []):
            if neighbor in path:
                return True
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
        path.remove(node)
        return False

    for t in transactions:
        if t not in visited:
            if has_cycle(t):
                return False, adj # Not serializable
    
    return True, adj # Serializable

# Example
schedule = "R1(A); W1(A); R2(A); W2(A)"
is_serializable, graph = check_conflict_serializability(schedule)
print(f"Is serializable: {is_serializable}")
print(f"Precedence Graph: {graph}")
`,
  'Java': `import java.util.*;
import java.util.regex.*;

class Operation {
    char type; int transaction; String dataItem;
    Operation(char t, int tr, String di) { type=t; transaction=tr; dataItem=di; }
}

public class SerializabilityChecker {

    public static boolean hasCycle(Map<Integer, List<Integer>> adj, int startNode, Set<Integer> visited, Set<Integer> recursionStack) {
        visited.add(startNode);
        recursionStack.add(startNode);

        for (Integer neighbor : adj.getOrDefault(startNode, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                if (hasCycle(adj, neighbor, visited, recursionStack)) return true;
            } else if (recursionStack.contains(neighbor)) {
                return true;
            }
        }
        recursionStack.remove(startNode);
        return false;
    }

    public static boolean isConflictSerializable(String scheduleStr) {
        List<Operation> ops = new ArrayList<>();
        Pattern p = Pattern.compile("([RW])(\\\\d+)\\\\(([^)]+)\\\\)");
        Matcher m = p.matcher(scheduleStr);
        while (m.find()) {
            ops.add(new Operation(m.group(1).charAt(0), Integer.parseInt(m.group(2)), m.group(3)));
        }

        Set<Integer> transactions = new HashSet<>();
        ops.forEach(op -> transactions.add(op.transaction));

        Map<Integer, List<Integer>> adj = new HashMap<>();
        transactions.forEach(t -> adj.put(t, new ArrayList<>()));

        for (int i = 0; i < ops.size(); i++) {
            for (int j = i + 1; j < ops.size(); j++) {
                Operation op1 = ops.get(i);
                Operation op2 = ops.get(j);
                if (op1.transaction != op2.transaction && op1.dataItem.equals(op2.dataItem) && (op1.type == 'W' || op2.type == 'W')) {
                    if(!adj.get(op1.transaction).contains(op2.transaction)) {
                        adj.get(op1.transaction).add(op2.transaction);
                    }
                }
            }
        }

        Set<Integer> visited = new HashSet<>();
        Set<Integer> recursionStack = new HashSet<>();
        for (Integer t : transactions) {
            if (!visited.contains(t)) {
                if (hasCycle(adj, t, visited, recursionStack)) return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        String schedule = "R1(A); W2(A); R1(B); W2(B)";
        System.out.println("Is serializable: " + isConflictSerializable(schedule));
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <set>
#include <regex>

struct Operation { char type; int transaction; std::string dataItem; };

bool hasCycleUtil(int u, std::map<int, std::vector<int>>& adj, std::set<int>& visited, std::set<int>& recursionStack) {
    visited.insert(u);
    recursionStack.insert(u);
    for (int v : adj[u]) {
        if (visited.find(v) == visited.end()) {
            if (hasCycleUtil(v, adj, visited, recursionStack)) return true;
        } else if (recursionStack.find(v) != recursionStack.end()) {
            return true;
        }
    }
    recursionStack.erase(u);
    return false;
}

bool isConflictSerializable(const std::string& scheduleStr) {
    std::vector<Operation> ops;
    std::regex re("([RW])(\\d+)\\((\\w+)\\)");
    auto words_begin = std::sregex_iterator(scheduleStr.begin(), scheduleStr.end(), re);
    auto words_end = std::sregex_iterator();

    for (std::sregex_iterator i = words_begin; i != words_end; ++i) {
        std::smatch match = *i;
        ops.push_back({match[1].str()[0], std::stoi(match[2].str()), match[3].str()});
    }

    std::set<int> transactions;
    for(const auto& op : ops) transactions.insert(op.transaction);

    std::map<int, std::vector<int>> adj;
    for(int t : transactions) adj[t] = {};
    
    for(size_t i = 0; i < ops.size(); ++i) {
        for(size_t j = i + 1; j < ops.size(); ++j) {
            if (ops[i].transaction != ops[j].transaction && ops[i].dataItem == ops[j].dataItem && (ops[i].type == 'W' || ops[j].type == 'W')) {
                adj[ops[i].transaction].push_back(ops[j].transaction);
            }
        }
    }
    
    std::set<int> visited, recursionStack;
    for (int t : transactions) {
        if (visited.find(t) == visited.end()) {
            if (hasCycleUtil(t, adj, visited, recursionStack)) return false;
        }
    }
    return true;
}

int main() {
    std::string schedule = "R1(A); W2(A); R1(B); W2(B)";
    std::cout << "Is serializable: " << std::boolalpha << isConflictSerializable(schedule) << std::endl;
    return 0;
}
`
};
