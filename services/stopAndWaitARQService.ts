export type EventType = 'SEND_DATA' | 'RECEIVE_DATA' | 'SEND_ACK' | 'RECEIVE_ACK' | 'TIMEOUT' | 'DROP_DATA' | 'DROP_ACK' | 'INFO';

export interface SimulationEvent {
  time: number;
  type: EventType;
  description: string;
  senderState: { nextFrameToSend: 0 | 1 };
  receiverState: { expectedFrame: 0 | 1 };
  packet?: {
    type: 'DATA' | 'ACK';
    seq: 0 | 1;
    isLost?: boolean;
    isDelayed?: boolean;
  };
}

export const generateStopAndWaitSimulation = (
  packetCount: number,
  scenarios: { [key: number]: { loseData?: boolean; loseAck?: boolean; delayAck?: boolean } }
): SimulationEvent[] => {
  const events: SimulationEvent[] = [];
  let time = 0;
  let senderSeq: 0 | 1 = 0;
  let receiverSeq: 0 | 1 = 0;

  const addEvent = (type: EventType, description: string, packet?: SimulationEvent['packet']) => {
    events.push({ time, type, description, senderState: { nextFrameToSend: senderSeq }, receiverState: { expectedFrame: receiverSeq }, packet });
  };

  addEvent('INFO', 'Simulation started.');

  for (let i = 0; i < packetCount; i++) {
    let ackReceived = false;
    let attempts = 0;

    while (!ackReceived && attempts < 3) { // Limit attempts to prevent infinite loops
      const scenario = scenarios[i] || {};
      const currentSenderSeq = senderSeq;
      
      // SEND DATA
      time++;
      addEvent('SEND_DATA', `Sender sends Frame ${currentSenderSeq}.`, { type: 'DATA', seq: currentSenderSeq });

      if (scenario.loseData && attempts === 0) { // Only lose it on the first try
          time++;
          addEvent('DROP_DATA', `Frame ${currentSenderSeq} is lost in transit!`, { type: 'DATA', seq: currentSenderSeq, isLost: true });
      } else {
          // RECEIVE DATA
          time++;
          if (currentSenderSeq === receiverSeq) {
              addEvent('RECEIVE_DATA', `Receiver gets expected Frame ${currentSenderSeq}.`, { type: 'DATA', seq: currentSenderSeq });
              
              // SEND ACK
              time++;
              if (scenario.loseAck && attempts === 0) {
                  addEvent('SEND_ACK', `Receiver sends ACK ${receiverSeq}.`, { type: 'ACK', seq: receiverSeq });
                  time++;
                  addEvent('DROP_ACK', `ACK ${receiverSeq} is lost!`, { type: 'ACK', seq: receiverSeq, isLost: true });
              } else if (scenario.delayAck && attempts === 0) {
                   addEvent('SEND_ACK', `Receiver sends ACK ${receiverSeq}. (Delayed)`, { type: 'ACK', seq: receiverSeq, isDelayed: true });
                   // Timeout will happen first
              } else {
                  addEvent('SEND_ACK', `Receiver sends ACK ${receiverSeq}.`, { type: 'ACK', seq: receiverSeq });
                  // RECEIVE ACK
                  time++;
                  addEvent('RECEIVE_ACK', `Sender gets ACK ${receiverSeq}. Ready for next frame.`, { type: 'ACK', seq: receiverSeq });
                  ackReceived = true;
                  senderSeq = senderSeq === 0 ? 1 : 0; // Flip sender seq
                  receiverSeq = receiverSeq === 0 ? 1 : 0; // Flip receiver seq
                  continue;
              }

          } else {
              addEvent('RECEIVE_DATA', `Receiver gets duplicate Frame ${currentSenderSeq}. Discarding.`, { type: 'DATA', seq: currentSenderSeq });
              // Resend ACK for the frame it's actually waiting for
              const ackToSend = currentSenderSeq === 0 ? 1 : 0;
              time++;
              addEvent('SEND_ACK', `Receiver resends ACK ${ackToSend}.`, { type: 'ACK', seq: ackToSend });
              // This ACK will be for the previous frame, so the sender will ignore it and timeout.
          }
      }

      // TIMEOUT
      time++;
      addEvent('TIMEOUT', `Timer for Frame ${currentSenderSeq} expires. Retransmitting...`);
      attempts++;
    }

    if (!ackReceived) {
        addEvent('INFO', `Failed to send packet ${i} after multiple retries. Halting.`);
        break;
    }
  }

  time++;
  addEvent('INFO', 'All packets sent successfully.');
  
  return events;
};
