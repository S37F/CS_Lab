
export const primsCode = {
  'Python': `import heapq

def prims_mst(graph, start_node):
    # graph is an adjacency list: {node: {neighbor: weight, ...}}
    mst = []
    visited = set()
    total_weight = 0
    
    # Priority queue stores (weight, start_node, end_node)
    pq = [(0, start_node, start_node)]

    while pq and len(visited) < len(graph):
        weight, u, v = heapq.heappop(pq)
        
        if v in visited:
            continue
            
        visited.add(v)
        total_weight += weight
        if u != v: # To avoid adding a non-edge for the start node
            mst.append((u, v, weight))
        
        for neighbor, neighbor_weight in graph[v].items():
            if neighbor not in visited:
                heapq.heappush(pq, (neighbor_weight, v, neighbor))
                
    return mst, total_weight

# Example
graph = {
    'A': {'B': 4, 'C': 2},
    'B': {'A': 4, 'D': 5, 'C': 1},
    'C': {'A': 2, 'B': 1, 'E': 8},
    'D': {'B': 5, 'E': 2, 'F': 6},
    'E': {'C': 8, 'D': 2, 'F': 1},
    'F': {'D': 6, 'E': 1}
}
mst, weight = prims_mst(graph, 'A')
print(f"MST Edges: {mst}")
print(f"Total Weight: {weight}")
`,
  'Java': `import java.util.*;

class PrimsAlgorithm {
    static class Edge implements Comparable<Edge> {
        String to;
        int weight;
        public Edge(String to, int weight) { this.to = to; this.weight = weight; }
        public int compareTo(Edge other) { return this.weight - other.weight; }
    }

    public static int primsMST(Map<String, List<Edge>> adjList, String startNode) {
        PriorityQueue<Edge> pq = new PriorityQueue<>();
        Set<String> visited = new HashSet<>();
        int totalWeight = 0;

        pq.add(new Edge(startNode, 0));

        while (!pq.isEmpty() && visited.size() < adjList.size()) {
            Edge current = pq.poll();
            String u = current.to;
            
            if (visited.contains(u)) continue;
            
            visited.add(u);
            totalWeight += current.weight;
            System.out.println("Added node: " + u + " with edge weight: " + current.weight);

            for (Edge neighborEdge : adjList.getOrDefault(u, Collections.emptyList())) {
                if (!visited.contains(neighborEdge.to)) {
                    pq.add(neighborEdge);
                }
            }
        }
        return totalWeight;
    }

    public static void main(String[] args) {
        // ... build adjacency list graph ...
        // int totalWeight = primsMST(adjList, "A");
        System.out.println("See simulator for a running example.");
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <queue>
#include <set>

using namespace std;

using Edge = pair<int, string>; // {weight, destination_node}
using Graph = map<string, vector<Edge>>;

int primsMST(const Graph& graph, const string& startNode) {
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    set<string> visited;
    int total_weight = 0;

    pq.push({0, startNode});

    while (!pq.empty() && visited.size() < graph.size()) {
        int weight = pq.top().first;
        string u = pq.top().second;
        pq.pop();

        if (visited.count(u)) {
            continue;
        }

        visited.insert(u);
        total_weight += weight;
        cout << "Added node " << u << " with edge weight " << weight << endl;

        if (graph.count(u)) {
            for (const auto& edge : graph.at(u)) {
                if (!visited.count(edge.second)) {
                    pq.push({edge.first, edge.second});
                }
            }
        }
    }
    return total_weight;
}

int main() {
    Graph graph;
    graph["A"].push_back({4, "B"}); graph["B"].push_back({4, "A"});
    graph["A"].push_back({2, "C"}); graph["C"].push_back({2, "A"});
    // ... add all other edges
    
    int weight = primsMST(graph, "A");
    cout << "Total MST Weight: " << weight << endl;

    return 0;
}
`
};
