
export const kruskalsCode = {
  'Python': `class DSU:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            # Union by rank
            if self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_i] = root_j
                if self.rank[root_i] == self.rank[root_j]:
                    self.rank[root_j] += 1

def kruskals_mst(vertices, edges):
    # Edges is a list of tuples: (weight, u, v)
    edges.sort()
    
    mst = []
    dsu = DSU(vertices)
    total_weight = 0
    
    for weight, u, v in edges:
        if dsu.find(u) != dsu.find(v):
            dsu.union(u, v)
            mst.append((u, v, weight))
            total_weight += weight
            
    return mst, total_weight

# Example
vertices = ['A', 'B', 'C', 'D', 'E', 'F']
edges = [
    (2, 'A', 'D'), (3, 'A', 'B'), (2, 'B', 'D'), (1, 'B', 'E'),
    (4, 'B', 'C'), (5, 'D', 'E'), (7, 'E', 'F'), (6, 'C', 'F')
]
mst, weight = kruskals_mst(vertices, edges)
print(f"MST Edges: {mst}")
print(f"Total Weight: {weight}")
`,
  'Java': `import java.util.*;

class KruskalsAlgorithm {
    static class Edge implements Comparable<Edge> {
        String src, dest;
        int weight;

        public int compareTo(Edge compareEdge) {
            return this.weight - compareEdge.weight;
        }
    }

    static class DSU {
        Map<String, String> parent = new HashMap<>();
        public DSU(Set<String> vertices) {
            for (String v : vertices) parent.put(v, v);
        }
        String find(String i) {
            if (parent.get(i).equals(i)) return i;
            parent.put(i, find(parent.get(i)));
            return parent.get(i);
        }
        void union(String i, String j) {
            String rootI = find(i);
            String rootJ = find(j);
            if (!rootI.equals(rootJ)) parent.put(rootI, rootJ);
        }
    }

    public static List<Edge> kruskalsMST(Set<String> vertices, List<Edge> edges) {
        Collections.sort(edges);
        List<Edge> mst = new ArrayList<>();
        DSU dsu = new DSU(vertices);
        
        for (Edge edge : edges) {
            if (!dsu.find(edge.src).equals(dsu.find(edge.dest))) {
                dsu.union(edge.src, edge.dest);
                mst.add(edge);
            }
        }
        return mst;
    }

    public static void main(String[] args) {
        // ... (instantiate vertices and edges) ...
        // List<Edge> mst = kruskalsMST(vertices, edges);
        System.out.println("See simulator for a running example.");
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>

struct Edge {
    int weight;
    std::string src, dest;
};

struct DSU {
    std::map<std::string, std::string> parent;
    DSU(const std::vector<std::string>& vertices) {
        for (const auto& v : vertices) parent[v] = v;
    }
    std::string find(std::string i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    void unite(std::string i, std::string j) {
        std::string root_i = find(i);
        std::string root_j = find(j);
        if (root_i != root_j) parent[root_i] = root_j;
    }
};

int main() {
    std::vector<std::string> vertices = {"A", "B", "C", "D", "E", "F"};
    std::vector<Edge> edges = {
        {2, "A", "D"}, {3, "A", "B"}, {2, "B", "D"}, {1, "B", "E"},
        {4, "B", "C"}, {5, "D", "E"}, {7, "E", "F"}, {6, "C", "F"}
    };

    std::sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.weight < b.weight;
    });

    DSU dsu(vertices);
    std::vector<Edge> mst;
    int total_weight = 0;

    for (const auto& edge : edges) {
        if (dsu.find(edge.src) != dsu.find(edge.dest)) {
            dsu.unite(edge.src, edge.dest);
            mst.push_back(edge);
            total_weight += edge.weight;
        }
    }

    std::cout << "MST Edges:" << std::endl;
    for (const auto& edge : mst) {
        std::cout << "(" << edge.src << " - " << edge.dest << ") w: " << edge.weight << std::endl;
    }
    std::cout << "Total Weight: " << total_weight << std::endl;

    return 0;
}
`
};
