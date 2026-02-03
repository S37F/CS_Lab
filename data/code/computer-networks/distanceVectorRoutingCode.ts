
export const distanceVectorRoutingCode = {
    'Python': `# Distance Vector Routing is a distributed algorithm.
# This code simulates the update logic for a single router.

class Router:
    def __init__(self, name, neighbors):
        self.name = name
        # {neighbor: cost}
        self.neighbors = neighbors
        # {destination: (next_hop, cost)}
        self.routing_table = {name: (name, 0)}
        for neighbor, cost in neighbors.items():
            self.routing_table[neighbor] = (neighbor, cost)

    def update_routing_table(self, neighbor_name, neighbor_table):
        updated = False
        neighbor_cost = self.neighbors[neighbor_name]

        for dest, (_, cost) in neighbor_table.items():
            new_cost = neighbor_cost + cost
            
            # If path through neighbor is shorter or doesn't exist yet
            if dest not in self.routing_table or new_cost < self.routing_table[dest][1]:
                self.routing_table[dest] = (neighbor_name, new_cost)
                updated = True
        return updated
    
    def display_table(self):
        print(f"--- Routing Table for {self.name} ---")
        for dest, (hop, cost) in self.routing_table.items():
            print(f"Dest: {dest}, Next Hop: {hop}, Cost: {cost}")

# Conceptual Simulation
# A -> B (1), A -> C (4)
# B -> C (2)
routerA = Router('A', {'B': 1, 'C': 4})
routerB = Router('B', {'A': 1, 'C': 2})
routerC = Router('C', {'A': 4, 'B': 2})

# Round 1: Routers exchange tables
print("Initial Tables:")
routerA.display_table()
routerB.display_table()
routerC.display_table()

print("\\nAfter one round of updates:")
routerA.update_routing_table('B', routerB.routing_table)
routerA.update_routing_table('C', routerC.routing_table)
# ... update B and C as well
routerA.display_table() # A should now know it can reach C via B with cost 3
`,
    'Java': `import java.util.*;

// Distance Vector Routing is best modeled with objects and message passing.
class Router {
    String name;
    // {Neighbor -> Cost to neighbor}
    Map<String, Integer> neighbors; 
    // {Destination -> {Next Hop, Total Cost}}
    Map<String, Map.Entry<String, Integer>> routingTable;

    public Router(String name, Map<String, Integer> neighbors) {
        this.name = name;
        this.neighbors = neighbors;
        this.routingTable = new HashMap<>();
        this.routingTable.put(name, new AbstractMap.SimpleEntry<>(name, 0));
        for (Map.Entry<String, Integer> entry : neighbors.entrySet()) {
            this.routingTable.put(entry.getKey(), new AbstractMap.SimpleEntry<>(entry.getKey(), entry.getValue()));
        }
    }

    public boolean updateRoutingTable(String neighborName, Map<String, Map.Entry<String, Integer>> neighborTable) {
        boolean updated = false;
        int costToNeighbor = this.neighbors.get(neighborName);

        for (Map.Entry<String, Map.Entry<String, Integer>> entry : neighborTable.entrySet()) {
            String dest = entry.getKey();
            int costFromNeighbor = entry.getValue().getValue();
            int newCost = costToNeighbor + costFromNeighbor;

            if (!routingTable.containsKey(dest) || newCost < routingTable.get(dest).getValue()) {
                routingTable.put(dest, new AbstractMap.SimpleEntry<>(neighborName, newCost));
                updated = true;
            }
        }
        return updated;
    }
    
    public void printTable() { /* ... */ }
}

public class DVR {
    public static void main(String[] args) {
        System.out.println("The simulation requires multiple Router objects exchanging state.");
        System.out.println("Please see the simulator for a clearer view of the process.");
    }
}
`,
    'C++': `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <limits>

const int INF = std::numeric_limits<int>::max();

class Router {
    std::string name;
    // {Neighbor, Cost}
    std::map<std::string, int> neighbors;
    // {Destination, {Next Hop, Cost}}
    std::map<std::string, std::pair<std::string, int>> routingTable;

public:
    Router(std::string n, std::map<std::string, int> neigh) : name(n), neighbors(neigh) {
        routingTable[name] = {name, 0};
        for(const auto& pair : neighbors) {
            routingTable[pair.first] = {pair.first, pair.second};
        }
    }

    bool updateRoutingTable(const std::string& neighborName, const std::map<std::string, std::pair<std::string, int>>& neighborTable) {
        bool updated = false;
        int costToNeighbor = neighbors.at(neighborName);

        for (const auto& entry : neighborTable) {
            const std::string& dest = entry.first;
            int costFromNeighbor = entry.second.second;
            int newCost = costToNeighbor + costFromNeighbor;

            if (routingTable.find(dest) == routingTable.end() || newCost < routingTable[dest].second) {
                routingTable[dest] = {neighborName, newCost};
                updated = true;
            }
        }
        return updated;
    }

    void printTable() { /* ... */ }
};

int main() {
    std::cout << "The simulation requires multiple Router objects exchanging state." << std::endl;
    return 0;
}
`
};
