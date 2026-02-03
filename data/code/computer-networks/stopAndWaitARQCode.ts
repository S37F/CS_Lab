export const stopAndWaitARQCode = {
  'Python': `import time
import random

# This is a conceptual simulation, not for production network code.
# Receiver state would be managed differently in a real implementation.
_receiver_expected_seq = 0

def sender(data_stream):
    global _receiver_expected_seq
    _receiver_expected_seq = 0
    sequence_number = 0
    
    for data in data_stream:
        ack_received = False
        while not ack_received:
            print(f"Sender: Sending frame {sequence_number} with data '{data}'")
            # Simulate sending frame to receiver
            ack = receiver((sequence_number, data))
            
            # Simulate network conditions
            if random.random() < 0.2: # 20% chance of losing ACK
                print("Sender: ACK lost!")
                time.sleep(0.1) # Simulate Timeout
                print("Sender: Timeout! Retransmitting...")
                continue

            if ack is not None and ack == sequence_number:
                print(f"Sender: Received ACK {ack}. Moving to next frame.")
                ack_received = True
                sequence_number = 1 - sequence_number # Flip sequence number
            else:
                print(f"Sender: Received incorrect ACK or no ACK. Retransmitting...")
                time.sleep(0.1) # Simulate Timeout

def receiver(frame):
    global _receiver_expected_seq
    
    # Simulate data frame loss
    if random.random() < 0.2: # 20% chance of losing data
        print("Receiver: Frame lost in transit!")
        return None

    seq, data = frame
    print(f"Receiver: Received frame with sequence {seq}.")
    
    if seq == _receiver_expected_seq:
        print(f"Receiver: Frame {seq} is expected. Processing data: '{data}'. Sending ACK {seq}.")
        _receiver_expected_seq = 1 - _receiver_expected_seq # Expect next sequence
        return seq
    else:
        print(f"Receiver: Duplicate frame {seq} received. Discarding. Resending ACK for previous frame.")
        return 1 - _receiver_expected_seq

# Example
data_to_send = ["Packet1", "Packet2", "Packet3"]
sender(data_to_send)
`,
  'Java': `// Stop-and-Wait ARQ is more about process interaction than a single function.
// The following is a conceptual simulation.

import java.util.Random;

class StopAndWait {
    static int expectedFrame = 0;
    static Random rand = new Random();

    // Simulates the sender's logic
    public static void sender(String[] dataStream) {
        int seqNum = 0;
        for (String data : dataStream) {
            boolean ackReceived = false;
            while (!ackReceived) {
                System.out.println("Sender: Sending frame " + seqNum + " with data '" + data + "'");
                Integer ack = receiver(seqNum, data); // Simulate sending

                if (ack != null && ack == seqNum) {
                    System.out.println("Sender: Received ACK " + ack + ". Moving on.");
                    ackReceived = true;
                    seqNum = 1 - seqNum; // Flip sequence
                } else {
                    System.out.println("Sender: Timeout or wrong ACK! Retransmitting...");
                    // In a real system, a timer would trigger this.
                }
            }
        }
    }

    // Simulates the receiver's logic
    public static Integer receiver(int seq, String data) {
        // Simulate data loss
        if (rand.nextDouble() < 0.2) {
            System.out.println("Receiver: Frame lost!");
            return null;
        }

        System.out.println("Receiver: Received frame with seq " + seq);
        if (seq == expectedFrame) {
            System.out.println("Receiver: Correct frame. Sending ACK " + seq);
            expectedFrame = 1 - expectedFrame; // Expect next frame
            
            // Simulate ACK loss
            if (rand.nextDouble() < 0.2) {
                 System.out.println("Sender: ACK lost in transit!");
                 return null;
            }
            return seq;
        } else {
            System.out.println("Receiver: Duplicate frame. Resending ACK for " + (1 - expectedFrame));
            return 1 - expectedFrame;
        }
    }

    public static void main(String[] args) {
        String[] data = {"Packet1", "Packet2", "Packet3"};
        sender(data);
    }
}
`,
};
