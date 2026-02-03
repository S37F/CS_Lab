import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const GoBackNARQArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Go-Back-N ARQ is a specific instance of the Automatic Repeat reQuest (ARQ) protocol used to provide reliable communication over an unreliable channel. It improves upon the inefficiency of Stop-and-Wait by using a "sliding window" to allow the sender to transmit multiple frames before needing an acknowledgment.</p>
                <p>The goal is to increase channel utilization by keeping it busy with frames, rather than waiting idly for an ACK after every single frame.</p>
            </Section>

            <Section title="How It Works">
                <p>The core concepts are the sender's window, sequence numbers, and cumulative acknowledgments.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Sender's Window:</strong> The sender maintains a window of up to N consecutive sequence numbers. It is allowed to send frames with sequence numbers within this window.</li>
                    <li><strong>Frame Sending:</strong> The sender transmits frames within its window and starts a timer for the oldest unacknowledged frame.</li>
                    <li><strong>Cumulative Acknowledgment:</strong> The receiver sends a single acknowledgment (ACK) for the highest-numbered in-order frame it has received. For example, if the receiver gets frames 0, 1, 2, and 4, it will repeatedly send ACK 2, indicating it is waiting for frame 3. It discards frame 4 because it is out of order.</li>
                    <li><strong>Receiving ACKs:</strong> When the sender receives an ACK for sequence number 'n', it knows that all frames up to and including 'n' have been received correctly. It then "slides" its window forward to start from 'n+1'.</li>
                    <li><strong>Timeout:</strong> If the timer for the oldest unacknowledged frame expires, the sender assumes that frame and all subsequent frames in the window were lost. It then goes back and retransmits all frames in the current window, starting from the one that timed out.</li>
                </ol>
            </Section>

            <Section title="Disadvantages">
                <p>The main drawback of Go-Back-N is its potential to retransmit a large number of frames, even if only one was lost. For example, if frame 5 is lost but frames 6, 7, and 8 are received correctly, the receiver will discard 6, 7, and 8. When the sender's timer expires, it will have to retransmit not only frame 5 but also 6, 7, and 8 again. This wastes bandwidth.</p>
                <p>Selective Repeat ARQ addresses this inefficiency by allowing the receiver to buffer out-of-order frames and only requesting the specific frames that were lost.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default GoBackNARQArticle;
