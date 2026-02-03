export const fpGrowthCode = {
    'Python': `from collections import defaultdict, Counter

class FPNode:
    """Node in the FP-tree"""
    def __init__(self, item, count, parent):
        self.item = item
        self.count = count
        self.parent = parent
        self.children = {}
        self.link = None  # Link to next node with same item

class FPTree:
    """FP-Tree data structure"""
    def __init__(self, transactions, min_support, item_counts):
        self.min_support = min_support
        self.header_table = {}
        self.root = FPNode(None, 0, None)
        
        # Build the tree
        for transaction in transactions:
            # Sort items by frequency (descending)
            sorted_items = sorted(
                [item for item in transaction if item in item_counts],
                key=lambda x: item_counts[x],
                reverse=True
            )
            self._insert_transaction(sorted_items, 1)
    
    def _insert_transaction(self, items, count):
        """Insert a transaction into the FP-tree"""
        current_node = self.root
        
        for item in items:
            if item in current_node.children:
                current_node.children[item].count += count
            else:
                # Create new node
                new_node = FPNode(item, count, current_node)
                current_node.children[item] = new_node
                
                # Update header table
                if item not in self.header_table:
                    self.header_table[item] = new_node
                else:
                    # Link to existing nodes with same item
                    current = self.header_table[item]
                    while current.link:
                        current = current.link
                    current.link = new_node
            
            current_node = current_node.children[item]

def fp_growth(transactions, min_support):
    """
    FP-Growth algorithm for frequent pattern mining
    transactions: list of sets/lists
    min_support: int (absolute count)
    """
    # Count item frequencies
    item_counts = Counter()
    for transaction in transactions:
        item_counts.update(transaction)
    
    # Filter items by minimum support
    item_counts = {item: count for item, count in item_counts.items() 
                   if count >= min_support}
    
    if not item_counts:
        return []
    
    # Build FP-tree
    tree = FPTree(transactions, min_support, item_counts)
    
    # Mine patterns
    patterns = []
    
    def mine_tree(tree, prefix):
        # Get items sorted by frequency (ascending for bottom-up mining)
        items = sorted(tree.header_table.keys(), 
                      key=lambda x: sum_item_counts(tree.header_table[x]))
        
        for item in items:
            # New pattern
            new_pattern = prefix + [item]
            support = sum_item_counts(tree.header_table[item])
            patterns.append((frozenset(new_pattern), support))
            
            # Build conditional pattern base
            conditional_patterns = []
            node = tree.header_table[item]
            
            while node:
                path = []
                parent = node.parent
                while parent.parent:  # Don't include root
                    path.append(parent.item)
                    parent = parent.parent
                
                if path:
                    conditional_patterns.extend([path] * node.count)
                node = node.link
            
            # Build conditional FP-tree
            if conditional_patterns:
                conditional_counts = Counter()
                for pattern in conditional_patterns:
                    conditional_counts.update(pattern)
                
                conditional_counts = {k: v for k, v in conditional_counts.items() 
                                     if v >= min_support}
                
                if conditional_counts:
                    conditional_tree = FPTree(conditional_patterns, 
                                            min_support, 
                                            conditional_counts)
                    if conditional_tree.header_table:
                        mine_tree(conditional_tree, new_pattern)
    
    def sum_item_counts(node):
        """Sum counts of all nodes with same item"""
        total = 0
        while node:
            total += node.count
            node = node.link
        return total
    
    mine_tree(tree, [])
    return patterns

# Example
transactions = [
    ['bread', 'milk'],
    ['bread', 'diapers', 'beer', 'eggs'],
    ['milk', 'diapers', 'beer', 'cola'],
    ['bread', 'milk', 'diapers', 'beer'],
    ['bread', 'milk', 'diapers', 'cola']
]

min_support = 3  # Absolute count
frequent_patterns = fp_growth(transactions, min_support)

print(f"Frequent Patterns (min_support={min_support}):")
for pattern, support in sorted(frequent_patterns, key=lambda x: x[1], reverse=True):
    print(f"{set(pattern)}: {support}")
`,
    'Java': `import java.util.*;

class FPNode {
    String item;
    int count;
    FPNode parent;
    Map<String, FPNode> children;
    FPNode link;  // Link to next node with same item
    
    public FPNode(String item, int count, FPNode parent) {
        this.item = item;
        this.count = count;
        this.parent = parent;
        this.children = new HashMap<>();
        this.link = null;
    }
}

class FPTree {
    FPNode root;
    Map<String, FPNode> headerTable;
    int minSupport;
    
    public FPTree(List<List<String>> transactions, int minSupport, Map<String, Integer> itemCounts) {
        this.minSupport = minSupport;
        this.headerTable = new HashMap<>();
        this.root = new FPNode(null, 0, null);
        
        // Build tree
        for (List<String> transaction : transactions) {
            List<String> sortedItems = new ArrayList<>();
            for (String item : transaction) {
                if (itemCounts.containsKey(item)) {
                    sortedItems.add(item);
                }
            }
            // Sort by frequency (descending)
            sortedItems.sort((a, b) -> itemCounts.get(b) - itemCounts.get(a));
            insertTransaction(sortedItems, 1);
        }
    }
    
    private void insertTransaction(List<String> items, int count) {
        FPNode currentNode = root;
        
        for (String item : items) {
            if (currentNode.children.containsKey(item)) {
                currentNode.children.get(item).count += count;
            } else {
                FPNode newNode = new FPNode(item, count, currentNode);
                currentNode.children.put(item, newNode);
                
                // Update header table
                if (!headerTable.containsKey(item)) {
                    headerTable.put(item, newNode);
                } else {
                    FPNode current = headerTable.get(item);
                    while (current.link != null) {
                        current = current.link;
                    }
                    current.link = newNode;
                }
            }
            currentNode = currentNode.children.get(item);
        }
    }
}

public class FPGrowth {
    
    public static List<Map.Entry<Set<String>, Integer>> fpGrowth(
            List<List<String>> transactions, int minSupport) {
        
        // Count item frequencies
        Map<String, Integer> itemCounts = new HashMap<>();
        for (List<String> transaction : transactions) {
            for (String item : transaction) {
                itemCounts.put(item, itemCounts.getOrDefault(item, 0) + 1);
            }
        }
        
        // Filter by minimum support
        itemCounts.entrySet().removeIf(entry -> entry.getValue() < minSupport);
        
        if (itemCounts.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Build FP-tree
        FPTree tree = new FPTree(transactions, minSupport, itemCounts);
        
        // Mine patterns
        List<Map.Entry<Set<String>, Integer>> patterns = new ArrayList<>();
        mineTree(tree, new ArrayList<>(), patterns, minSupport);
        
        return patterns;
    }
    
    private static void mineTree(FPTree tree, List<String> prefix,
                                List<Map.Entry<Set<String>, Integer>> patterns,
                                int minSupport) {
        // Implementation of recursive mining...
        // (Simplified for brevity - full implementation mirrors Python)
    }
    
    public static void main(String[] args) {
        List<List<String>> transactions = Arrays.asList(
            Arrays.asList("bread", "milk"),
            Arrays.asList("bread", "diapers", "beer", "eggs"),
            Arrays.asList("milk", "diapers", "beer", "cola"),
            Arrays.asList("bread", "milk", "diapers", "beer"),
            Arrays.asList("bread", "milk", "diapers", "cola")
        );
        
        int minSupport = 3;
        List<Map.Entry<Set<String>, Integer>> patterns = fpGrowth(transactions, minSupport);
        
        System.out.println("Frequent Patterns (min_support=" + minSupport + "):");
        for (Map.Entry<Set<String>, Integer> pattern : patterns) {
            System.out.println(pattern.getKey() + ": " + pattern.getValue());
        }
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <algorithm>
#include <memory>

using namespace std;

class FPNode {
public:
    string item;
    int count;
    shared_ptr<FPNode> parent;
    map<string, shared_ptr<FPNode>> children;
    shared_ptr<FPNode> link;
    
    FPNode(string item, int count, shared_ptr<FPNode> parent)
        : item(item), count(count), parent(parent), link(nullptr) {}
};

class FPTree {
public:
    shared_ptr<FPNode> root;
    map<string, shared_ptr<FPNode>> headerTable;
    int minSupport;
    
    FPTree(const vector<vector<string>>& transactions, 
           int minSupport,
           const map<string, int>& itemCounts) 
        : minSupport(minSupport) {
        root = make_shared<FPNode>("", 0, nullptr);
        
        // Build tree
        for (const auto& transaction : transactions) {
            vector<string> sortedItems;
            for (const auto& item : transaction) {
                if (itemCounts.find(item) != itemCounts.end()) {
                    sortedItems.push_back(item);
                }
            }
            
            // Sort by frequency (descending)
            sort(sortedItems.begin(), sortedItems.end(),
                 [&itemCounts](const string& a, const string& b) {
                     return itemCounts.at(a) > itemCounts.at(b);
                 });
            
            insertTransaction(sortedItems, 1);
        }
    }
    
    void insertTransaction(const vector<string>& items, int count) {
        auto currentNode = root;
        
        for (const auto& item : items) {
            if (currentNode->children.find(item) != currentNode->children.end()) {
                currentNode->children[item]->count += count;
            } else {
                auto newNode = make_shared<FPNode>(item, count, currentNode);
                currentNode->children[item] = newNode;
                
                // Update header table
                if (headerTable.find(item) == headerTable.end()) {
                    headerTable[item] = newNode;
                } else {
                    auto current = headerTable[item];
                    while (current->link) {
                        current = current->link;
                    }
                    current->link = newNode;
                }
            }
            currentNode = currentNode->children[item];
        }
    }
};

vector<pair<set<string>, int>> fpGrowth(
        const vector<vector<string>>& transactions, int minSupport) {
    
    // Count item frequencies
    map<string, int> itemCounts;
    for (const auto& transaction : transactions) {
        for (const auto& item : transaction) {
            itemCounts[item]++;
        }
    }
    
    // Filter by minimum support
    map<string, int> frequentItems;
    for (const auto& [item, count] : itemCounts) {
        if (count >= minSupport) {
            frequentItems[item] = count;
        }
    }
    
    if (frequentItems.empty()) {
        return {};
    }
    
    // Build FP-tree
    FPTree tree(transactions, minSupport, frequentItems);
    
    // Mine patterns (simplified)
    vector<pair<set<string>, int>> patterns;
    // Full recursive mining implementation...
    
    return patterns;
}

int main() {
    vector<vector<string>> transactions = {
        {"bread", "milk"},
        {"bread", "diapers", "beer", "eggs"},
        {"milk", "diapers", "beer", "cola"},
        {"bread", "milk", "diapers", "beer"},
        {"bread", "milk", "diapers", "cola"}
    };
    
    int minSupport = 3;
    auto patterns = fpGrowth(transactions, minSupport);
    
    cout << "Frequent Patterns (min_support=" << minSupport << "):" << endl;
    for (const auto& [pattern, support] : patterns) {
        cout << "{ ";
        for (const auto& item : pattern) {
            cout << item << " ";
        }
        cout << "}: " << support << endl;
    }
    
    return 0;
}
`
};
