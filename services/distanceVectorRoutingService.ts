export interface Router {
  id: string;
  position: { x: number; y: number };
}

export interface Link {
  from: string;
  to: string;
  cost: number;
}

export interface RoutingTableEntry {
  destination: string;
  cost: number;
  nextHop: string;
}

export interface DVR_SimulationEvent {
  iteration: number;
  description: string;
  routingTables: Map<string, RoutingTableEntry[]>;
  updatedRouters: string[];
  converged: boolean;
}

export const generateDistanceVectorSimulation = (
  routers: Router[],
  links: Link[]
): DVR_SimulationEvent[] => {
  const events: DVR_SimulationEvent[] = [];
  
  // Initialize routing tables
  const routingTables = new Map<string, Map<string, RoutingTableEntry>>();
  routers.forEach(router => {
    const table = new Map<string, RoutingTableEntry>();
    // Distance to self is 0
    table.set(router.id, { destination: router.id, cost: 0, nextHop: router.id });
    // Initialize direct neighbors
    links.forEach(link => {
      if (link.from === router.id) {
        table.set(link.to, { destination: link.to, cost: link.cost, nextHop: link.to });
      } else if (link.to === router.id) {
        table.set(link.from, { destination: link.from, cost: link.cost, nextHop: link.from });
      }
    });
    routingTables.set(router.id, table);
  });
  
  const getTableSnapshot = (): Map<string, RoutingTableEntry[]> => {
    const snapshot = new Map<string, RoutingTableEntry[]>();
    routingTables.forEach((table, routerId) => {
      snapshot.set(routerId, Array.from(table.values()));
    });
    return snapshot;
  };
  
  events.push({
    iteration: 0,
    description: 'Initial state: Routers know only about themselves and direct neighbors.',
    routingTables: getTableSnapshot(),
    updatedRouters: [],
    converged: false,
  });
  
  let iteration = 0;
  let hasUpdates = true;
  const MAX_ITERATIONS = 20;
  
  while (hasUpdates && iteration < MAX_ITERATIONS) {
    iteration++;
    hasUpdates = false;
    const updatedRouters: string[] = [];
    
    // Each router receives distance vectors from neighbors
    routers.forEach(router => {
      const currentTable = routingTables.get(router.id)!;
      let routerUpdated = false;
      
      // Get neighbors
      const neighbors = new Set<string>();
      links.forEach(link => {
        if (link.from === router.id) neighbors.add(link.to);
        if (link.to === router.id) neighbors.add(link.from);
      });
      
      // For each neighbor, check their routing table
      neighbors.forEach(neighborId => {
        const neighborTable = routingTables.get(neighborId)!;
        const costToNeighbor = currentTable.get(neighborId)?.cost || Infinity;
        
        // Check each destination in neighbor's table
        neighborTable.forEach((entry, dest) => {
          if (dest === router.id) return; // Skip routes to self
          
          const newCost = costToNeighbor + entry.cost;
          const currentEntry = currentTable.get(dest);
          
          // Bellman-Ford: update if we found a better path
          if (!currentEntry || newCost < currentEntry.cost) {
            currentTable.set(dest, {
              destination: dest,
              cost: newCost,
              nextHop: neighborId,
            });
            routerUpdated = true;
          }
        });
      });
      
      if (routerUpdated) {
        hasUpdates = true;
        updatedRouters.push(router.id);
      }
    });
    
    events.push({
      iteration,
      description: updatedRouters.length > 0
        ? `Iteration ${iteration}: Routers ${updatedRouters.join(', ')} updated their tables.`
        : `Iteration ${iteration}: No updates. Network converged.`,
      routingTables: getTableSnapshot(),
      updatedRouters,
      converged: !hasUpdates,
    });
  }
  
  return events;
};

export const getDefaultTopology = (): { routers: Router[]; links: Link[] } => {
  const routers: Router[] = [
    { id: 'A', position: { x: 100, y: 150 } },
    { id: 'B', position: { x: 300, y: 100 } },
    { id: 'C', position: { x: 500, y: 150 } },
    { id: 'D', position: { x: 300, y: 250 } },
  ];
  
  const links: Link[] = [
    { from: 'A', to: 'B', cost: 1 },
    { from: 'B', to: 'C', cost: 3 },
    { from: 'A', to: 'D', cost: 4 },
    { from: 'D', to: 'C', cost: 1 },
    { from: 'B', to: 'D', cost: 2 },
  ];
  
  return { routers, links };
};
