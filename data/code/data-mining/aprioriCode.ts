
export const aprioriCode = {
    'Python': `from collections import defaultdict

def apriori(transactions, min_support):
    """
    transactions: list of sets, e.g., [{'milk', 'bread'}, {'bread', 'butter'}]
    min_support: float, e.g., 0.5
    """
    item_counts = defaultdict(int)
    for t in transactions:
        for item in t:
            item_counts[item] += 1
    
    num_transactions = len(transactions)
    
    # L1: Frequent 1-itemsets
    l1 = {frozenset([item]) for item, count in item_counts.items() 
          if count / num_transactions >= min_support}
    
    frequent_itemsets = l1
    k = 2
    
    while True:
        # Ck: Candidate k-itemsets generation
        candidates_k = set()
        l_k_minus_1 = list(frequent_itemsets)
        for i in range(len(l_k_minus_1)):
            for j in range(i + 1, len(l_k_minus_1)):
                union_set = l_k_minus_1[i].union(l_k_minus_1[j])
                if len(union_set) == k:
                    candidates_k.add(union_set)
        
        if not candidates_k:
            break
            
        # Pruning and counting support
        l_k = set()
        candidate_counts = defaultdict(int)
        for t in transactions:
            for cand in candidates_k:
                if cand.issubset(t):
                    candidate_counts[cand] += 1
                    
        for cand, count in candidate_counts.items():
            if count / num_transactions >= min_support:
                l_k.add(cand)
        
        if not l_k:
            break
        
        frequent_itemsets.update(l_k)
        k += 1
        
    return frequent_itemsets

# Example
transactions = [
    {'bread', 'milk'},
    {'bread', 'diapers', 'beer', 'eggs'},
    {'milk', 'diapers', 'beer', 'cola'},
    {'bread', 'milk', 'diapers', 'beer'},
    {'bread', 'milk', 'diapers', 'cola'}
]
min_support = 0.6
frequent_sets = apriori(transactions, min_support)

print("Frequent Itemsets (min_support=60%):")
for itemset in frequent_sets:
    print(list(itemset))
`,
    'Java': `// The Apriori algorithm in Java requires careful management of itemsets and candidates.
// The following is a conceptual outline.

import java.util.*;

public class Apriori {

    public Set<Set<String>> findFrequentItemsets(List<Set<String>> transactions, double minSupport) {
        // 1. Scan transactions to find frequent 1-itemsets (L1)
        // ...

        // 2. Loop k from 2 up
        //    a. Generate candidate k-itemsets (Ck) from frequent (k-1)-itemsets (Lk-1).
        //       - This involves a self-join and a pruning step.
        //    b. Scan transactions again to count support for each candidate in Ck.
        //    c. Filter candidates to get frequent k-itemsets (Lk).
        //    d. If Lk is empty, break.
        //    e. Add Lk to the final result.
        
        System.out.println("Full Apriori implementation is complex. See Python code.");
        return new HashSet<>();
    }

    public static void main(String[] args) {
        // ... (setup transactions and minSupport) ...
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <algorithm>

// Apriori algorithm implementation in C++ is complex.
// The following is a conceptual outline.

using Itemset = std::set<std::string>;

class Apriori {
public:
    std::set<Itemset> findFrequentItemsets(const std::vector<Itemset>& transactions, double minSupport) {
        // 1. Find frequent 1-itemsets (L1)
        // ...

        // 2. Loop k = 2, 3, ...
        //    a. Generate candidate k-itemsets (Ck) from L(k-1).
        //    b. Count support for candidates by scanning the database.
        //    c. Generate Lk by filtering Ck.
        //    d. Break if Lk is empty.
        
        std::cout << "Full Apriori implementation is complex. See Python code." << std::endl;
        return {};
    }
};

int main() {
    // ... (setup transactions and minSupport) ...
    return 0;
}
`
};
