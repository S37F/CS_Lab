export type EventType = 'SEND' | 'ACK' | 'NAK' | 'TIMEOUT' | 'DROP_DATA' | 'DROP_ACK' | 'INFO' | 'DELIVER' | 'BUFFER';

export interface SR_SimulationEvent {
  time: number;
  type: EventType;
  description: string;
  senderState: {
    windowBase: number;
    windowSize: number;
    sentPackets: number[];
    ackedPackets: number[];
    timedOutPackets: number[];
  };
  receiverState: {
    windowBase: number;
    windowSize: number;
    receivedPackets: number[];
    bufferedPackets: number[];
  };
  packet?: {
    type: 'DATA' | 'ACK' | 'NAK';
    seq: number;
    isLost?: boolean;
  };
}

export const generateSelectiveRepeatSimulation = (
  packetCount: number,
  windowSize: number,
  scenarios: { loseData?: number[]; loseAck?: number[] }
): SR_SimulationEvent[] => {
  const events: SR_SimulationEvent[] = [];
  let time = 0;
  
  let senderWindowBase = 0;
  const sentPackets = new Set<number>();
  const ackedPackets = new Set<number>();
  const timedOutPackets = new Set<number>();
  const timers = new Map<number, number>(); // seq -> timeout time
  
  let receiverWindowBase = 0;
  const receivedPackets = new Set<number>();
  const bufferedPackets = new Set<number>();
  
  const TIMEOUT_DURATION = 5;
  
  const addEvent = (type: EventType, description: string, packet?: SR_SimulationEvent['packet']) => {
    events.push({
      time,
      type,
      description,
      senderState: {
        windowBase: senderWindowBase,
        windowSize,
        sentPackets: Array.from(sentPackets),
        ackedPackets: Array.from(ackedPackets),
        timedOutPackets: Array.from(timedOutPackets),
      },
      receiverState: {
        windowBase: receiverWindowBase,
        windowSize,
        receivedPackets: Array.from(receivedPackets),
        bufferedPackets: Array.from(bufferedPackets),
      },
      packet,
    });
  };
  
  addEvent('INFO', 'Selective Repeat ARQ Simulation started.');
  
  let nextSeqNum = 0;
  
  while (senderWindowBase < packetCount) {
    time++;
    
    // Check for timeouts
    const nowTimedOut: number[] = [];
    timers.forEach((timeoutTime, seq) => {
      if (time >= timeoutTime && !ackedPackets.has(seq)) {
        nowTimedOut.push(seq);
      }
    });
    
    nowTimedOut.forEach(seq => {
      timedOutPackets.add(seq);
      timers.delete(seq);
      addEvent('TIMEOUT', `Timeout for Frame ${seq}. Will retransmit.`);
    });
    
    // Retransmit timed out packets
    nowTimedOut.forEach(seq => {
      time++;
      timedOutPackets.delete(seq);
      
      if (scenarios.loseData?.includes(seq)) {
        addEvent('DROP_DATA', `Retransmit Frame ${seq}, but it is lost.`, { type: 'DATA', seq, isLost: true });
        timers.set(seq, time + TIMEOUT_DURATION);
      } else {
        addEvent('SEND', `Retransmit Frame ${seq}.`, { type: 'DATA', seq });
        timers.set(seq, time + TIMEOUT_DURATION);
        
        // Receiver processes
        time++;
        if (!receivedPackets.has(seq)) {
          receivedPackets.add(seq);
          
          if (seq === receiverWindowBase) {
            // In-order delivery
            let deliverCount = 0;
            while (receivedPackets.has(receiverWindowBase)) {
              deliverCount++;
              bufferedPackets.delete(receiverWindowBase);
              receiverWindowBase++;
            }
            addEvent('DELIVER', `Receiver gets Frame ${seq}. Delivers ${deliverCount} frame(s) to upper layer.`);
          } else if (seq < receiverWindowBase + windowSize) {
            // Within window, buffer it
            bufferedPackets.add(seq);
            addEvent('BUFFER', `Receiver gets Frame ${seq} (out of order). Buffered.`);
          }
        }
        
        // Send ACK
        time++;
        if (scenarios.loseAck?.includes(seq)) {
          addEvent('DROP_ACK', `Receiver sends ACK ${seq}, but it is lost.`, { type: 'ACK', seq, isLost: true });
        } else {
          addEvent('ACK', `Receiver sends ACK ${seq}.`, { type: 'ACK', seq });
          // Sender receives ACK
          time++;
          ackedPackets.add(seq);
          timers.delete(seq);
          
          // Slide window if base is acked
          while (ackedPackets.has(senderWindowBase) && senderWindowBase < packetCount) {
            senderWindowBase++;
          }
          addEvent('INFO', `Sender receives ACK ${seq}. Window base: ${senderWindowBase}.`);
        }
      }
    });
    
    // Send new packets within window
    while (nextSeqNum < senderWindowBase + windowSize && nextSeqNum < packetCount) {
      const seq = nextSeqNum;
      nextSeqNum++;
      
      if (ackedPackets.has(seq)) continue;
      
      time++;
      sentPackets.add(seq);
      
      if (scenarios.loseData?.includes(seq)) {
        addEvent('DROP_DATA', `Sender sends Frame ${seq}, but it is lost.`, { type: 'DATA', seq, isLost: true });
        timers.set(seq, time + TIMEOUT_DURATION);
      } else {
        addEvent('SEND', `Sender sends Frame ${seq}.`, { type: 'DATA', seq });
        timers.set(seq, time + TIMEOUT_DURATION);
        
        // Receiver processes
        time++;
        if (!receivedPackets.has(seq)) {
          receivedPackets.add(seq);
          
          if (seq === receiverWindowBase) {
            // In-order delivery
            let deliverCount = 0;
            while (receivedPackets.has(receiverWindowBase)) {
              deliverCount++;
              bufferedPackets.delete(receiverWindowBase);
              receiverWindowBase++;
            }
            addEvent('DELIVER', `Receiver gets Frame ${seq}. Delivers ${deliverCount} frame(s) to upper layer.`);
          } else if (seq < receiverWindowBase + windowSize) {
            // Within window, buffer it
            bufferedPackets.add(seq);
            addEvent('BUFFER', `Receiver gets Frame ${seq} (out of order). Buffered.`);
          }
        }
        
        // Send ACK
        time++;
        if (scenarios.loseAck?.includes(seq)) {
          addEvent('DROP_ACK', `Receiver sends ACK ${seq}, but it is lost.`, { type: 'ACK', seq, isLost: true });
        } else {
          addEvent('ACK', `Receiver sends ACK ${seq}.`, { type: 'ACK', seq });
          // Sender receives ACK
          time++;
          ackedPackets.add(seq);
          timers.delete(seq);
          
          // Slide window if base is acked
          while (ackedPackets.has(senderWindowBase) && senderWindowBase < packetCount) {
            senderWindowBase++;
          }
          addEvent('INFO', `Sender receives ACK ${seq}. Window base: ${senderWindowBase}.`);
        }
      }
    }
    
    // Safety check
    if (time > 1000) break;
  }
  
  addEvent('INFO', 'All packets successfully acknowledged.');
  return events;
};
