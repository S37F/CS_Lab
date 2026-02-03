export const dijkstrasCode = {
  'Python': `import heapq

def dijkstra(graph, start_node):
    # Priority queue stores (distance, node)
    pq = [(0, start_node)]
    # Dictionary to store the shortest distance to each node
    distances = {node: float('infinity') for node in graph}
    distances[start_node] = 0
    
    shortest_path_tree = {}

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        # If we've found a shorter path already, skip
        if current_distance > distances[current_node]:
            continue

        # Explore neighbors
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            # If a shorter path to the neighbor is found
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                shortest_path_tree[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, shortest_path_tree

# Example graph represented as an adjacency list
# graph = { node: { neighbor: weight, ... }, ... }
graph = {
    'A': {'B': 4, 'C': 2},
    'B': {'A': 4, 'D': 5, 'C': 1},
    'C': {'A': 2, 'B': 1, 'E': 8, 'D': 8},
    'D': {'B': 5, 'C': 8, 'E': 2, 'F': 6},
    'E': {'C': 8, 'D': 2, 'F': 1},
    'F': {'D': 6, 'E': 1}
}

distances, path = dijkstra(graph, 'A')
print("Shortest distances from A:", distances)
`,
  'Java': `import java.util.*;

class DijkstraAlgorithm {
    static class Node implements Comparable<Node> {
        public String name;
        public int distance;

        public Node(String name, int distance) {
            this.name = name;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    public static Map<String, Integer> dijkstra(Map<String, Map<String, Integer>> graph, String startNode) {
        PriorityQueue<Node> pq = new PriorityQueue<>();
        Map<String, Integer> distances = new HashMap<>();
        
        for (String node : graph.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(startNode, 0);
        
        pq.add(new Node(startNode, 0));

        while (!pq.isEmpty()) {
            Node currentNode = pq.poll();
            String u = currentNode.name;
            int uDist = currentNode.distance;
            
            if (uDist > distances.get(u)) {
                continue;
            }

            Map<String, Integer> neighbors = graph.getOrDefault(u, Collections.emptyMap());
            for (Map.Entry<String, Integer> neighborEntry : neighbors.entrySet()) {
                String v = neighborEntry.getKey();
                int weight = neighborEntry.getValue();
                
                if (distances.get(u) + weight < distances.get(v)) {
                    distances.put(v, distances.get(u) + weight);
                    pq.add(new Node(v, distances.get(v)));
                }
            }
        }
        return distances;
    }

    public static void main(String[] args) {
        Map<String, Map<String, Integer>> graph = new HashMap<>();
        // Populate the graph similar to the Python example
        graph.put("A", Map.of("B", 4, "C", 2));
        graph.put("B", Map.of("A", 4, "D", 5, "C", 1));
        graph.put("C", Map.of("A", 2, "B", 1, "E", 8, "D", 8));
        graph.put("D", Map.of("B", 5, "C", 8, "E", 2, "F", 6));
        graph.put("E", Map.of("C", 8, "D", 2, "F", 1));
        graph.put("F", Map.of("D", 6, "E", 1));

        Map<String, Integer> distances = dijkstra(graph, "A");
        System.out.println("Shortest distances from A: " + distances);
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <queue>
#include <limits>

using namespace std;

const int INF = numeric_limits<int>::max();

// Define graph structure: map of nodes to a map of neighbors and weights
using Graph = map<string, map<string, int>>;

map<string, int> dijkstra(const Graph& graph, const string& startNode) {
    // Priority queue stores {distance, node}
    // C++ priority_queue is a max-heap, so we store negative distances to simulate a min-heap
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<pair<int, string>>> pq;
    
    map<string, int> distances;
    for (const auto& pair : graph) {
        distances[pair.first] = INF;
    }
    
    distances[startNode] = 0;
    pq.push({0, startNode});

    while (!pq.empty()) {
        int current_dist = pq.top().first;
        string current_node = pq.top().second;
        pq.pop();

        if (current_dist > distances[current_node]) {
            continue;
        }

        if (graph.count(current_node)) {
            for (const auto& neighbor_pair : graph.at(current_node)) {
                string neighbor = neighbor_pair.first;
                int weight = neighbor_pair.second;
                
                if (distances[current_node] != INF && distances[current_node] + weight < distances[neighbor]) {
                    distances[neighbor] = distances[current_node] + weight;
                    pq.push({distances[neighbor], neighbor});
                }
            }
        }
    }
    return distances;
}

int main() {
    Graph graph = {
        {"A", {{"B", 4}, {"C", 2}}},
        {"B", {{"A", 4}, {"D", 5}, {"C", 1}}},
        {"C", {{"A", 2}, {"B", 1}, {"E", 8}, {"D", 8}}},
        {"D", {{"B", 5}, {"C", 8}, {"E", 2}, {"F", 6}}},
        {"E", {{"C", 8}, {"D", 2}, {"F", 1}}},
        {"F", {{"D", 6}, {"E", 1}}}
    };

    map<string, int> distances = dijkstra(graph, "A");
    cout << "Shortest distances from A:" << endl;
    for (const auto& pair : distances) {
        cout << pair.first << ": " << pair.second << endl;
    }

    return 0;
}
`
};
