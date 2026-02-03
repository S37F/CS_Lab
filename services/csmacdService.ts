export type EventType = 'TRANSMIT' | 'COLLISION' | 'BACKOFF' | 'SUCCESS' | 'INFO';

export interface CSMACD_SimulationEvent {
  time: number;
  type: EventType;
  description: string;
  nodes: {
    id: number;
    status: 'idle' | 'transmitting' | 'waiting' | 'success' | 'collision';
    backoffTime?: number;
    attemptsCount?: number;
  }[];
  channelBusy: boolean;
  collisionDetected: boolean;
  metrics: {
    totalCollisions: number;
    successfulTransmissions: number;
    totalAttempts: number;
  };
}

export const generateCSMACDSimulation = (
  nodeCount: number,
  transmissionAttempts: { node: number; startTime: number }[]
): CSMACD_SimulationEvent[] => {
  const events: CSMACD_SimulationEvent[] = [];
  let time = 0;
  let totalCollisions = 0;
  let successfulTransmissions = 0;
  let totalAttempts = 0;
  
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    status: 'idle' as const,
    backoffTime: 0,
    attemptsCount: 0,
  }));
  
  let channelBusy = false;
  let transmittingNode = -1;
  
  const addEvent = (type: EventType, description: string, collisionDetected = false) => {
    events.push({
      time,
      type,
      description,
      nodes: nodes.map(n => ({ ...n })),
      channelBusy,
      collisionDetected,
      metrics: { totalCollisions, successfulTransmissions, totalAttempts },
    });
  };
  
  addEvent('INFO', 'CSMA/CD Simulation started.');
  
  // Schedule transmission attempts
  const schedule = [...transmissionAttempts].sort((a, b) => a.startTime - b.startTime);
  const pendingTransmissions = new Map<number, number>(); // node -> ready time
  
  schedule.forEach(({ node, startTime }) => {
    pendingTransmissions.set(node, startTime);
  });
  
  while (pendingTransmissions.size > 0 || channelBusy) {
    time++;
    
    // Update backoff times
    nodes.forEach(node => {
      if (node.backoffTime > 0) {
        node.backoffTime--;
        if (node.backoffTime === 0) {
          node.status = 'idle';
        }
      }
    });
    
    // Check if transmission completes
    if (channelBusy && transmittingNode >= 0) {
      const transmitDuration = 3; // Fixed transmission duration
      if (time % transmitDuration === 0) {
        nodes[transmittingNode].status = 'success';
        channelBusy = false;
        successfulTransmissions++;
        addEvent('SUCCESS', `Node ${transmittingNode} completed transmission successfully.`);
        transmittingNode = -1;
      }
    }
    
    // Check for nodes ready to transmit
    const readyNodes = Array.from(pendingTransmissions.entries())
      .filter(([nodeId, readyTime]) => readyTime <= time && nodes[nodeId].backoffTime === 0)
      .map(([nodeId]) => nodeId);
    
    if (readyNodes.length > 0) {
      if (!channelBusy) {
        if (readyNodes.length === 1) {
          // Single node transmits
          const nodeId = readyNodes[0];
          nodes[nodeId].status = 'transmitting';
          nodes[nodeId].attemptsCount!++;
          channelBusy = true;
          transmittingNode = nodeId;
          totalAttempts++;
          pendingTransmissions.delete(nodeId);
          addEvent('TRANSMIT', `Node ${nodeId} starts transmission (Attempt ${nodes[nodeId].attemptsCount}).`);
        } else {
          // Multiple nodes try to transmit - collision!
          totalCollisions++;
          totalAttempts += readyNodes.length;
          readyNodes.forEach(nodeId => {
            nodes[nodeId].status = 'collision';
            nodes[nodeId].attemptsCount!++;
            // Calculate backoff time using binary exponential backoff
            const k = Math.min(nodes[nodeId].attemptsCount!, 10);
            const maxBackoff = Math.pow(2, k) - 1;
            nodes[nodeId].backoffTime = Math.floor(Math.random() * maxBackoff) + 1;
          });
          addEvent('COLLISION', `Collision detected! Nodes ${readyNodes.join(', ')} collided. Entering backoff.`, true);
          
          // Re-schedule after backoff
          readyNodes.forEach(nodeId => {
            pendingTransmissions.set(nodeId, time + nodes[nodeId].backoffTime!);
          });
        }
      } else {
        // Channel busy, nodes wait
        readyNodes.forEach(nodeId => {
          nodes[nodeId].status = 'waiting';
        });
      }
    }
  }
  
  addEvent('INFO', `Simulation complete. ${successfulTransmissions} successful, ${totalCollisions} collisions.`);
  return events;
};
