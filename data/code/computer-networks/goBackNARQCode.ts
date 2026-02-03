export const goBackNARQCode = {
  'Python': `import time
import random

# This is a highly conceptual simulation. A real implementation would involve threads/async operations.

WINDOW_SIZE = 4
TIMEOUT = 0.2

def sender(data_stream):
    base = 0
    next_seq_num = 0
    buffer = list(data_stream)
    
    while base < len(buffer):
        # Send all packets within the window
        while next_seq_num < base + WINDOW_SIZE and next_seq_num < len(buffer):
            packet = (next_seq_num, buffer[next_seq_num])
            print(f"Sender: Sending packet {packet[0]}")
            # Simulate sending to receiver (in a real system, this would be async)
            receiver_ack(packet) 
            next_seq_num += 1

        # Simulate waiting for ACKs and handling timeouts
        # This part is complex to simulate linearly. In reality, a timer runs for the 'base' packet.
        # Let's assume a function get_ack() that might return an ACK or None (for timeout)
        
        start_time = time.time()
        ack = None
        
        # Simple simulation of waiting for an ACK
        while time.time() - start_time < TIMEOUT:
            # In a real system, you'd check a queue of incoming ACKs
            # For this simulation, we'll just pretend we might get one
            if random.random() < 0.3: # Chance to "receive" an ACK
                # Simulate getting a valid cumulative ACK
                ack = base 
                break
        
        if ack is not None:
            print(f"Sender: Received ACK {ack}. Sliding window.")
            base = ack + 1
        else:
            print(f"Sender: Timeout for base {base}! Going back to {base}.")
            next_seq_num = base # Reset next_seq_num to retransmit the whole window

def receiver_ack(packet):
    # This would run on the receiver side
    global receiver_expected_seq_num
    seq_num, data = packet
    
    # Simulate packet loss
    if random.random() < 0.2:
        print(f"Receiver: Packet {seq_num} lost!")
        return

    print(f"Receiver: Received packet {seq_num}.")
    if seq_num == receiver_expected_seq_num:
        print(f"Receiver: Packet {seq_num} is expected. Sending ACK {seq_num}.")
        receiver_expected_seq_num += 1
        # In a real system, this ACK is sent back to the sender
    else:
        print(f"Receiver: Out of order packet {seq_num}. Discarding. Resending ACK {receiver_expected_seq_num - 1}.")

# Main execution
receiver_expected_seq_num = 0
data_to_send = [f"Packet-{i}" for i in range(10)]
sender(data_to_send)
`,
  'Java': `// Go-Back-N is complex and stateful, involving timers and concurrent sender/receiver logic.
// The following is a conceptual outline rather than a runnable, single-threaded example.

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class GoBackN {
    static final int WINDOW_SIZE = 4;
    static final int TIMEOUT = 2000; // ms

    private List<String> dataBuffer;
    private int base = 0;
    private int nextSeqNum = 0;
    private Timer timer;

    // --- SENDER LOGIC ---
    public void sender() {
        while (base < dataBuffer.size()) {
            // Send packets in the window
            while (nextSeqNum < base + WINDOW_SIZE && nextSeqNum < dataBuffer.size()) {
                sendPacket(nextSeqNum, dataBuffer.get(nextSeqNum));
                if (base == nextSeqNum) {
                    startTimer();
                }
                nextSeqNum++;
            }
            // The sender thread would now wait for ACKs or a timeout.
            // This is hard to represent linearly.
        }
    }

    public void onAckReceived(int ackNum) {
        // This method would be called by a networking thread
        if (ackNum >= base) {
            base = ackNum + 1;
            if (base == nextSeqNum) {
                stopTimer();
            } else {
                startTimer(); // Restart timer for the new base
            }
        }
    }

    public void onTimeout() {
        // This method would be called by the Timer
        System.out.println("Timeout! Retransmitting from " + base);
        nextSeqNum = base; // Go back to 'base'
        // The main sender loop would then retransmit the window.
    }

    // --- RECEIVER LOGIC ---
    private int expectedSeqNum = 0;

    public void receivePacket(int seqNum, String data) {
        if (seqNum == expectedSeqNum) {
            // Process data
            System.out.println("Receiver: Got expected packet " + seqNum);
            sendAck(expectedSeqNum);
            expectedSeqNum++;
        } else {
            System.out.println("Receiver: Out of order packet " + seqNum + ". Discarding.");
            // Resend ACK for the last in-order packet
            sendAck(expectedSeqNum - 1);
        }
    }
    
    // Helper methods
    private void sendPacket(int seq, String data) { System.out.println("Sender: Sending " + seq); }
    private void sendAck(int ack) { System.out.println("Receiver: Sending ACK " + ack); }
    private void startTimer() { /* Complex timer logic */ }
    private void stopTimer() { /* ... */ }
}
`,
};
