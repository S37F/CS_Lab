import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const StopAndWaitARQArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Stop-and-Wait Automatic Repeat reQuest (ARQ) is a simple method for reliable data transfer over an unreliable channel. It's a type of flow control protocol where the sender sends one frame at a time and then waits for an acknowledgment (ACK) from the receiver before sending the next frame.</p>
                <p>The goal is to ensure that each data frame is received correctly and in order, even if frames or acknowledgments are lost or corrupted.</p>
            </Section>

            <Section title="How It Works">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Frame Sending:</strong> The sender sends a single data frame with a sequence number (typically alternating between 0 and 1).</li>
                    <li><strong>Start Timer:</strong> After sending the frame, the sender starts a timer.</li>
                    <li><strong>Wait for ACK:</strong> The sender waits for an acknowledgment frame from the receiver. The ACK should contain the sequence number of the frame it is acknowledging.</li>
                    <li><strong>Receive ACK:</strong> If the correct ACK is received before the timer expires, the sender stops the timer, flips its sequence number, and sends the next data frame.</li>
                    <li><strong>Timeout:</strong> If the timer expires before the ACK is received (due to data loss or ACK loss), the sender assumes the frame was lost and retransmits the same frame with the same sequence number.</li>
                    <li><strong>Receiver Logic:</strong> The receiver waits for a specific sequence number. If it receives a frame with the expected sequence number, it sends back an ACK for that number and waits for the next one. If it receives a duplicate frame (with the old sequence number), it discards the duplicate but still sends an ACK for it to help the sender move on.</li>
                </ol>
            </Section>

            <Section title="Disadvantages">
                <p>The main drawback of Stop-and-Wait is its inefficiency, especially over channels with high latency. The sender spends most of its time waiting for an ACK instead of sending data. The channel utilization is very low because only one frame can be in transit at any given time.</p>
                <p>This inefficiency led to the development of more advanced protocols like Go-Back-N and Selective Repeat, which use a "sliding window" to allow multiple frames to be in transit simultaneously.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default StopAndWaitARQArticle;
