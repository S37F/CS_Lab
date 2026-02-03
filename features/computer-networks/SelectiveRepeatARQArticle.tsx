
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SelectiveRepeatARQArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Selective Repeat ARQ is a sliding window protocol used for reliable data transfer. It improves upon Go-Back-N ARQ by minimizing unnecessary retransmissions. Instead of retransmitting the entire window upon a single packet loss, Selective Repeat allows the sender to retransmit only the specific packets that were lost or corrupted.</p>
                <p>The goal is to achieve higher efficiency and throughput, especially on networks with high error rates or long round-trip times.</p>
            </Section>

            <Section title="How It Works">
                <p>Selective Repeat uses both a sender and a receiver window. The key difference from Go-Back-N is how acknowledgments and out-of-order packets are handled.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Sender & Receiver Windows:</strong> Both parties maintain a window of acceptable sequence numbers.</li>
                    <li><strong>Individual Acknowledgments:</strong> The receiver sends an individual acknowledgment (ACK) for each frame it receives correctly, even if it's out of order.</li>
                    <li><strong>Receiver Buffering:</strong> The receiver buffers any out-of-order frames that fall within its window until the missing frames arrive.</li>
                    <li><strong>Individual Timeouts:</strong> The sender maintains a separate timer for each unacknowledged frame it sends. If a timer expires for a specific frame, only that frame is retransmitted.</li>
                    <li><strong>Sliding the Window:</strong> The sender's window slides forward upon receiving an ACK for the oldest unacknowledged frame. The receiver's window slides forward once it receives a contiguous block of frames starting from its expected base.</li>
                </ol>
            </Section>

            <Section title="Advantages over Go-Back-N">
                <p>The primary advantage is efficiency. By only retransmitting lost frames, it avoids wasting bandwidth on frames that were already successfully received. This makes it far more suitable for noisy or high-latency channels.</p>
                <p>The main complexity lies in the receiver's logic, which must manage buffers for out-of-order packets, and the sender's logic, which must manage individual timers for each packet in its window.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SelectiveRepeatARQArticle;
