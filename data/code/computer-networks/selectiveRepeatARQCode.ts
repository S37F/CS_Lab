
export const selectiveRepeatARQCode = {
    'Python': `# Selective Repeat is complex and requires robust state management
# on both sender and receiver (timers for each packet, buffering, etc.).
# This is a highly conceptual overview.

class SelectiveRepeat:
    def __init__(self, window_size):
        self.window_size = window_size
        # ... sender state: base, next_seq_num, timers, sent_packets_buffer
        # ... receiver state: expected_seq_num, received_buffer

    def sender(self):
        # - Send packets if window is not full.
        # - For each packet sent, start a timer.
        # - On receiving an ACK for packet 'n':
        #   - Mark packet 'n' as ACKed.
        #   - If 'n' is the base of the window, slide the window forward
        #     until the first un-ACKed packet.
        # - On timeout for packet 'n':
        #   - Retransmit only packet 'n'.
        #   - Restart timer for packet 'n'.
        pass

    def receiver(self):
        # - On receiving packet 'n':
        #   - If 'n' is within the receiver's window:
        #     - Send ACK for 'n'.
        #     - If 'n' is the expected packet, deliver it and any subsequent
        #       buffered packets to the application. Slide the window.
        #     - If 'n' is not the expected packet, buffer it.
        #   - If 'n' is outside the window (but acknowledged), do nothing.
        #   - Otherwise (old packet), send ACK for it again.
        pass

print("Selective Repeat logic is state-intensive and best understood through the interactive simulator.")
`,
    'Java': `// The implementation of Selective Repeat is substantially complex
// due to per-packet timers and out-of-order buffering.

import java.util.*;

public class SelectiveRepeat {
    // Sender would maintain a map of sequence numbers to packet data,
    // a map of sequence numbers to timers, and a send window (base, nextSeqNum).

    // Receiver would maintain a receive window and a buffer for out-of-order packets.

    public void run() {
        System.out.println("Full implementation is complex and better suited for a multi-threaded simulation.");
        System.out.println("Please see the interactive simulator for a visual understanding.");
    }
    
    public static void main(String[] args) {
        new SelectiveRepeat().run();
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <map>
#include <chrono>

// The implementation of Selective Repeat is non-trivial, involving
// management of multiple timers and buffers.

class SelectiveRepeat {
public:
    void run() {
        // Sender:
        // - Manages a send window [send_base, next_seq_num).
        // - Uses a std::map<int, std::chrono::time_point> for per-packet timers.
        // - Retransmits only the timed-out packet.
        // - Slides window upon receiving ACK for send_base.

        // Receiver:
        // - Manages a receive window [recv_base, recv_base + N).
        // - Buffers out-of-order packets.
        // - Sends individual ACKs for each correctly received packet.
        // - Delivers buffered, in-order packets to the application and slides window.
        
        std::cout << "A full C++ implementation is complex. The simulator provides a clearer conceptual view." << std::endl;
    }
};

int main() {
    SelectiveRepeat sr;
    sr.run();
    return 0;
}
`
};
