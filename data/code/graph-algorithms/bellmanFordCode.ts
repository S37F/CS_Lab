
export const bellmanFordCode = {
  'Python': `def bellman_ford(graph, start_node):
    # graph = list of edges (u, v, weight)
    # vertices = set of all nodes
    
    vertices = set()
    for u, v, w in graph:
        vertices.add(u)
        vertices.add(v)
        
    distances = {v: float('infinity') for v in vertices}
    distances[start_node] = 0
    
    # Relax edges |V| - 1 times
    for _ in range(len(vertices) - 1):
        for u, v, weight in graph:
            if distances[u] != float('infinity') and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                
    # Check for negative weight cycles
    for u, v, weight in graph:
        if distances[u] != float('infinity') and distances[u] + weight < distances[v]:
            print("Graph contains a negative-weight cycle")
            return None
            
    return distances

# Example
# Note: Graph is a list of edges, not an adjacency list
edges = [
    ('S', 'A', 10), ('S', 'E', 8),
    ('A', 'C', 2), ('B', 'A', 1),
    ('C', 'B', -2), ('D', 'C', -1),
    ('D', 'A', -4), ('E', 'D', 1)
]
distances = bellman_ford(edges, 'S')
if distances:
    print(f"Shortest distances from S: {distances}")
`,
  'Java': `import java.util.*;

class BellmanFord {
    static class Edge {
        String src, dest;
        int weight;
        Edge(String s, String d, int w) { src = s; dest = d; weight = w; }
    }

    public static Map<String, Integer> bellmanFord(List<Edge> edges, Set<String> vertices, String startNode) {
        Map<String, Integer> distances = new HashMap<>();
        for (String v : vertices) {
            distances.put(v, Integer.MAX_VALUE);
        }
        distances.put(startNode, 0);

        // Relax edges |V| - 1 times
        for (int i = 0; i < vertices.size() - 1; i++) {
            for (Edge edge : edges) {
                if (distances.get(edge.src) != Integer.MAX_VALUE && 
                    distances.get(edge.src) + edge.weight < distances.get(edge.dest)) {
                    distances.put(edge.dest, distances.get(edge.src) + edge.weight);
                }
            }
        }
        
        // Check for negative cycles
        for (Edge edge : edges) {
            if (distances.get(edge.src) != Integer.MAX_VALUE && 
                distances.get(edge.src) + edge.weight < distances.get(edge.dest)) {
                System.out.println("Graph contains a negative-weight cycle");
                return null;
            }
        }
        
        return distances;
    }

    public static void main(String[] args) {
        // ... (instantiate vertices and edges) ...
        // Map<String, Integer> distances = bellmanFord(edges, vertices, "S");
        System.out.println("See simulator for a running example.");
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <limits>
#include <set>

using namespace std;
const int INF = numeric_limits<int>::max();

struct Edge {
    string src, dest;
    int weight;
};

map<string, int> bellmanFord(const vector<Edge>& edges, const set<string>& vertices, const string& startNode) {
    map<string, int> distances;
    for (const auto& v : vertices) {
        distances[v] = INF;
    }
    distances[startNode] = 0;

    for (int i = 0; i < vertices.size() - 1; ++i) {
        for (const auto& edge : edges) {
            if (distances[edge.src] != INF && distances[edge.src] + edge.weight < distances[edge.dest]) {
                distances[edge.dest] = distances[edge.src] + edge.weight;
            }
        }
    }

    for (const auto& edge : edges) {
        if (distances[edge.src] != INF && distances[edge.src] + edge.weight < distances[edge.dest]) {
            cout << "Graph contains a negative-weight cycle" << endl;
            return {}; // Return empty map
        }
    }
    
    return distances;
}

int main() {
    set<string> vertices = {"S", "A", "B", "C", "D", "E"};
    vector<Edge> edges = {
        {"S", "A", 10}, {"S", "E", 8}, {"A", "C", 2}, {"B", "A", 1},
        {"C", "B", -2}, {"D", "C", -1}, {"D", "A", -4}, {"E", "D", 1}
    };

    map<string, int> distances = bellmanFord(edges, vertices, "S");
    if (!distances.empty()) {
        cout << "Shortest distances from S:" << endl;
        for (const auto& pair : distances) {
            cout << pair.first << ": " << (pair.second == INF ? "INF" : to_string(pair.second)) << endl;
        }
    }
    return 0;
}
`
};
