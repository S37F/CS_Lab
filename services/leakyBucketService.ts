export type EventType = 'ARRIVAL' | 'LEAK' | 'DROP' | 'INFO';

export interface LeakyBucket_SimulationEvent {
  time: number;
  type: EventType;
  description: string;
  bucketState: {
    currentSize: number;
    capacity: number;
  };
  packet?: {
    size: number;
    accepted: boolean;
  };
  metrics: {
    totalArrived: number;
    totalAccepted: number;
    totalDropped: number;
    totalLeaked: number;
  };
}

export const generateLeakyBucketSimulation = (
  bucketCapacity: number,
  leakRate: number, // packets per time unit
  packetArrivals: { time: number; size: number }[]
): LeakyBucket_SimulationEvent[] => {
  const events: LeakyBucket_SimulationEvent[] = [];
  let currentSize = 0;
  let totalArrived = 0;
  let totalAccepted = 0;
  let totalDropped = 0;
  let totalLeaked = 0;
  
  const addEvent = (
    time: number,
    type: EventType,
    description: string,
    packet?: { size: number; accepted: boolean }
  ) => {
    events.push({
      time,
      type,
      description,
      bucketState: { currentSize, capacity: bucketCapacity },
      packet,
      metrics: { totalArrived, totalAccepted, totalDropped, totalLeaked },
    });
  };
  
  addEvent(0, 'INFO', `Leaky Bucket started. Capacity: ${bucketCapacity}, Leak rate: ${leakRate} packet/s`);
  
  // Sort arrivals by time
  const sortedArrivals = [...packetArrivals].sort((a, b) => a.time - b.time);
  
  let arrivalIndex = 0;
  let time = 0;
  const maxTime = sortedArrivals.length > 0 ? sortedArrivals[sortedArrivals.length - 1].time + 10 : 20;
  
  while (time <= maxTime) {
    // Handle packet arrivals at current time
    while (arrivalIndex < sortedArrivals.length && sortedArrivals[arrivalIndex].time === time) {
      const packet = sortedArrivals[arrivalIndex];
      totalArrived++;
      
      if (currentSize + packet.size <= bucketCapacity) {
        // Packet accepted
        currentSize += packet.size;
        totalAccepted++;
        addEvent(
          time,
          'ARRIVAL',
          `Packet of size ${packet.size} arrived and accepted. Bucket: ${currentSize}/${bucketCapacity}`,
          { size: packet.size, accepted: true }
        );
      } else {
        // Packet dropped (overflow)
        totalDropped++;
        addEvent(
          time,
          'DROP',
          `Packet of size ${packet.size} dropped (bucket overflow). Bucket: ${currentSize}/${bucketCapacity}`,
          { size: packet.size, accepted: false }
        );
      }
      
      arrivalIndex++;
    }
    
    // Leak packets at the leak rate
    if (currentSize > 0 && time > 0) {
      const leaked = Math.min(leakRate, currentSize);
      currentSize -= leaked;
      totalLeaked += leaked;
      addEvent(
        time,
        'LEAK',
        `Leaked ${leaked} unit(s). Bucket: ${currentSize}/${bucketCapacity}`
      );
    }
    
    time++;
  }
  
  addEvent(
    time,
    'INFO',
    `Simulation complete. Accepted: ${totalAccepted}, Dropped: ${totalDropped}`
  );
  
  return events;
};

export const generateRandomArrivals = (count: number, maxTime: number): { time: number; size: number }[] => {
  const arrivals: { time: number; size: number }[] = [];
  for (let i = 0; i < count; i++) {
    arrivals.push({
      time: Math.floor(Math.random() * maxTime),
      size: Math.floor(Math.random() * 3) + 1, // Size between 1-3
    });
  }
  return arrivals.sort((a, b) => a.time - b.time);
};
