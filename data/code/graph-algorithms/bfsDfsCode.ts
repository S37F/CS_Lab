export const bfsDfsCode = {
  'Python': `# Using a dictionary to represent an adjacency list
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# --- Breadth-First Search (BFS) ---
def bfs(graph, start_node):
    visited = set()
    queue = [start_node]
    visited.add(start_node)
    traversal_order = []

    while queue:
        node = queue.pop(0)
        traversal_order.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return traversal_order

print("BFS Traversal:", bfs(graph, 'A'))

# --- Depth-First Search (DFS) ---
def dfs(graph, start_node, visited=None, traversal_order=None):
    if visited is None:
        visited = set()
    if traversal_order is None:
        traversal_order = []
        
    visited.add(start_node)
    traversal_order.append(start_node)
    
    for neighbor in graph[start_node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited, traversal_order)
            
    return traversal_order
    
print("DFS Traversal:", dfs(graph, 'A'))
`,
  'Java': `import java.util.*;

public class GraphTraversals {
    private Map<String, List<String>> adjList = new HashMap<>();

    public void addEdge(String u, String v) {
        adjList.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adjList.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // For undirected graph
    }

    // --- Breadth-First Search (BFS) ---
    public List<String> bfs(String startNode) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        List<String> traversalOrder = new ArrayList<>();

        visited.add(startNode);
        queue.add(startNode);

        while (!queue.isEmpty()) {
            String node = queue.poll();
            traversalOrder.add(node);

            for (String neighbor : adjList.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return traversalOrder;
    }

    // --- Depth-First Search (DFS) ---
    public List<String> dfs(String startNode) {
        Set<String> visited = new HashSet<>();
        List<String> traversalOrder = new ArrayList<>();
        dfsRecursive(startNode, visited, traversalOrder);
        return traversalOrder;
    }

    private void dfsRecursive(String node, Set<String> visited, List<String> traversalOrder) {
        visited.add(node);
        traversalOrder.add(node);

        for (String neighbor : adjList.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                dfsRecursive(neighbor, visited, traversalOrder);
            }
        }
    }

    public static void main(String[] args) {
        GraphTraversals g = new GraphTraversals();
        g.addEdge("A", "B");
        g.addEdge("A", "C");
        g.addEdge("B", "D");
        g.addEdge("B", "E");
        g.addEdge("C", "F");
        g.addEdge("E", "F");

        System.out.println("BFS Traversal: " + g.bfs("A"));
        System.out.println("DFS Traversal: " + g.dfs("A"));
    }
}
`,
  'C++': `#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <map>
#include <set>
#include <algorithm>

class Graph {
private:
    std::map<std::string, std::vector<std::string>> adjList;

public:
    void addEdge(const std::string& u, const std::string& v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u); // For undirected graph
    }

    // --- Breadth-First Search (BFS) ---
    std::vector<std::string> bfs(const std::string& startNode) {
        std::set<std::string> visited;
        std::queue<std::string> q;
        std::vector<std::string> traversalOrder;

        visited.insert(startNode);
        q.push(startNode);

        while (!q.empty()) {
            std::string node = q.front();
            q.pop();
            traversalOrder.push_back(node);

            for (const std::string& neighbor : adjList[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        return traversalOrder;
    }

    // --- Depth-First Search (DFS) ---
    std::vector<std::string> dfs(const std::string& startNode) {
        std::set<std::string> visited;
        std::vector<std::string> traversalOrder;
        dfsRecursive(startNode, visited, traversalOrder);
        return traversalOrder;
    }

private:
    void dfsRecursive(const std::string& node, std::set<std::string>& visited, std::vector<std::string>& order) {
        visited.insert(node);
        order.push_back(node);

        for (const std::string& neighbor : adjList[node]) {
            if (visited.find(neighbor) == visited.end()) {
                dfsRecursive(neighbor, visited, order);
            }
        }
    }
};

int main() {
    Graph g;
    g.addEdge("A", "B");
    g.addEdge("A", "C");
    g.addEdge("B", "D");
    g.addEdge("B", "E");
    g.addEdge("C", "F");
    g.addEdge("E", "F");

    std::cout << "BFS Traversal: ";
    for (const auto& node : g.bfs("A")) std::cout << node << " ";
    std::cout << std::endl;

    std::cout << "DFS Traversal: ";
    for (const auto& node : g.dfs("A")) std::cout << node << " ";
    std::cout << std::endl;

    return 0;
}
`
};
