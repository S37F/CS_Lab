export const huffmanCodingCode = {
  'Python': `import heapq
from collections import defaultdict

def build_huffman_tree(text):
    frequency = defaultdict(int)
    for char in text:
        frequency[char] += 1
    
    # Priority queue stores (frequency, node)
    # Node is a list/tuple representing [char, left_child, right_child]
    priority_queue = [[freq, [char, "", ""]] for char, freq in frequency.items()]
    heapq.heapify(priority_queue)
    
    while len(priority_queue) > 1:
        lo = heapq.heappop(priority_queue)
        hi = heapq.heappop(priority_queue)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heapq.heappush(priority_queue, [lo[0] + hi[0]] + lo[1:] + hi[1:])
        
    return sorted(heapq.heappop(priority_queue)[1:], key=lambda p: (len(p[-1]), p))

def generate_codes(tree):
    codes = {}
    for node in tree:
        char, code = node[0], node[1]
        codes[char] = code
    return codes

# Example
text = "this is an example of a huffman tree"
tree = build_huffman_tree(text)
codes = generate_codes(tree)

print("Character Codes:")
for char, code in codes.items():
    print(f"'{char}': {code}")
`,
  'Java': `import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

class HuffmanNode implements Comparable<HuffmanNode> {
    int frequency;
    char data;
    HuffmanNode left, right;

    public int compareTo(HuffmanNode node) {
        return this.frequency - node.frequency;
    }
}

public class HuffmanCoding {

    public static Map<Character, String> generateCodes(String text) {
        Map<Character, Integer> frequencyMap = new HashMap<>();
        for (char c : text.toCharArray()) {
            frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
        }

        PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();
        for (Map.Entry<Character, Integer> entry : frequencyMap.entrySet()) {
            HuffmanNode node = new HuffmanNode();
            node.data = entry.getKey();
            node.frequency = entry.getValue();
            node.left = null;
            node.right = null;
            pq.add(node);
        }

        HuffmanNode root = null;
        while (pq.size() > 1) {
            HuffmanNode x = pq.peek();
            pq.poll();
            HuffmanNode y = pq.peek();
            pq.poll();

            HuffmanNode sum = new HuffmanNode();
            sum.frequency = x.frequency + y.frequency;
            sum.data = '-';
            sum.left = x;
            sum.right = y;
            root = sum;
            pq.add(sum);
        }
        
        Map<Character, String> huffmanCodes = new HashMap<>();
        printCodes(root, "", huffmanCodes);
        return huffmanCodes;
    }

    private static void printCodes(HuffmanNode root, String s, Map<Character, String> codes) {
        if (root.left == null && root.right == null && Character.isLetterOrDigit(root.data) || Character.isWhitespace(root.data)) {
            codes.put(root.data, s);
            return;
        }
        printCodes(root.left, s + "0", codes);
        printCodes(root.right, s + "1", codes);
    }

    public static void main(String[] args) {
        String text = "this is an example of a huffman tree";
        Map<Character, String> codes = generateCodes(text);
        
        System.out.println("Character Codes:");
        for (Map.Entry<Character, String> entry : codes.entrySet()) {
            System.out.println("'" + entry.getKey() + "': " + entry.getValue());
        }
    }
}
`,
  'C++': `#include <iostream>
#include <string>
#include <queue>
#include <map>
#include <vector>

struct HuffmanNode {
    char data;
    unsigned freq;
    HuffmanNode *left, *right;

    HuffmanNode(char data, unsigned freq) : data(data), freq(freq), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(HuffmanNode* l, HuffmanNode* r) {
        return (l->freq > r->freq);
    }
};

void generateCodes(HuffmanNode* root, std::string str, std::map<char, std::string>& codes) {
    if (!root) return;

    if (root->data != '$') { // Use '$' for internal nodes
        codes[root->data] = str;
    }

    generateCodes(root->left, str + "0", codes);
    generateCodes(root->right, str + "1", codes);
}

std::map<char, std::string> huffmanEncode(const std::string& text) {
    std::map<char, unsigned> freqMap;
    for (char c : text) {
        freqMap[c]++;
    }

    std::priority_queue<HuffmanNode*, std::vector<HuffmanNode*>, Compare> minHeap;
    for (auto pair : freqMap) {
        minHeap.push(new HuffmanNode(pair.first, pair.second));
    }

    while (minHeap.size() != 1) {
        HuffmanNode* left = minHeap.top(); minHeap.pop();
        HuffmanNode* right = minHeap.top(); minHeap.pop();

        HuffmanNode* top = new HuffmanNode('$', left->freq + right->freq);
        top->left = left;
        top->right = right;
        minHeap.push(top);
    }
    
    std::map<char, std::string> codes;
    generateCodes(minHeap.top(), "", codes);
    return codes;
}

int main() {
    std::string text = "this is an example of a huffman tree";
    auto codes = huffmanEncode(text);

    std::cout << "Character Codes:" << std::endl;
    for (auto pair : codes) {
        std::cout << "'" << pair.first << "': " << pair.second << std::endl;
    }

    return 0;
}
`
};
