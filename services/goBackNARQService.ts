export type EventType = 'SEND' | 'ACK' | 'TIMEOUT' | 'DROP_DATA' | 'DROP_ACK' | 'INFO' | 'SLIDE';

export interface GBN_SimulationEvent {
  time: number;
  type: EventType;
  description: string;
  senderState: {
    base: number;
    nextSeqNum: number;
    window: number[];
  };
  receiverState: {
    expectedSeqNum: number;
  };
  packet?: {
    type: 'DATA' | 'ACK';
    seq: number;
    isLost?: boolean;
  };
}

export const generateGoBackNSimulation = (
  packetCount: number,
  windowSize: number,
  scenarios: { loseData?: number[]; loseAck?: number[] }
): GBN_SimulationEvent[] => {
  const events: GBN_SimulationEvent[] = [];
  let time = 0;
  let base = 0;
  let nextSeqNum = 0;
  let expectedSeqNum = 0;

  const addEvent = (type: EventType, description: string, packet?: GBN_SimulationEvent['packet']) => {
    const window = Array.from({ length: nextSeqNum - base }, (_, i) => base + i);
    events.push({ time, type, description, senderState: { base, nextSeqNum, window }, receiverState: { expectedSeqNum }, packet });
  };

  addEvent('INFO', 'Simulation started.');

  while (base < packetCount) {
    // Sender sends all packets in the window
    while (nextSeqNum < base + windowSize && nextSeqNum < packetCount) {
      time++;
      if (scenarios.loseData?.includes(nextSeqNum)) {
        addEvent('DROP_DATA', `Sender sends Frame ${nextSeqNum}, but it is lost.`, { type: 'DATA', seq: nextSeqNum, isLost: true });
      } else {
        addEvent('SEND', `Sender sends Frame ${nextSeqNum}.`, { type: 'DATA', seq: nextSeqNum });
        
        // Receiver processes the frame
        if (nextSeqNum === expectedSeqNum) {
            expectedSeqNum++;
        }
        
        // Receiver sends cumulative ACK
        const ackNum = expectedSeqNum - 1;
        time++;
        if (scenarios.loseAck?.includes(ackNum)) {
            addEvent('DROP_ACK', `Receiver sends ACK ${ackNum}, but it is lost.`, { type: 'ACK', seq: ackNum, isLost: true });
        } else {
            addEvent('ACK', `Receiver gets Frame ${nextSeqNum} (expected ${expectedSeqNum-1}). Sends cumulative ACK ${ackNum}.`, { type: 'ACK', seq: ackNum });
             // Sender receives ACK
            if (ackNum >= base) {
                base = ackNum + 1;
                time++;
                addEvent('SLIDE', `Sender gets ACK ${ackNum}. Window slides to base ${base}.`);
            }
        }
      }
      nextSeqNum++;
    }
    
    // Check for timeout
    if (base < nextSeqNum) {
        time += 3; // Simulate waiting time leading to timeout
        addEvent('TIMEOUT', `Timer for Frame ${base} expires. Going back to N.`);
        nextSeqNum = base; // Go back N
    }
  }

  addEvent('INFO', 'All packets sent successfully.');
  return events;
};
