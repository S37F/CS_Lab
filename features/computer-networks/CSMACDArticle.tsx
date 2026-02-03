
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const CSMACDArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Carrier Sense Multiple Access with Collision Detection (CSMA/CD) is a network protocol for carrier transmission that operates in the Medium Access Control (MAC) layer. It is the protocol that was famously used in early Ethernet networks for local area networking.</p>
                <p>The goal is to manage how multiple stations share a single transmission medium (like a coaxial cable) without a central authority, minimizing collisions and recovering from them when they do occur.</p>
            </Section>

            <Section title="How It Works">
                <p>The process follows a "listen before you talk" principle:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Carrier Sense:</strong> A station wishing to transmit first listens to the channel to see if it is idle (i.e., no other station is transmitting).</li>
                    <li><strong>Multiple Access:</strong> If the channel is idle, the station starts transmitting its data frame. If it's busy, the station waits until it becomes idle.</li>
                    <li><strong>Collision Detection:</strong> While transmitting, the station simultaneously monitors the channel for collisions. A collision occurs if another station also started transmitting at roughly the same time. This is detected by checking if the signal on the wire is different from the signal being transmitted.</li>
                    <li><strong>Jam Signal & Backoff:</strong> If a collision is detected, the station immediately stops transmitting the data frame, sends a brief "jam signal" to ensure all stations are aware of the collision, and then waits for a random period of time before attempting to retransmit. This random wait time is determined by the <strong>Binary Exponential Backoff</strong> algorithm, which increases the random delay after each subsequent collision to reduce the chance of repeated collisions.</li>
                </ol>
            </Section>

            <Section title="Binary Exponential Backoff">
                <p>After the nth collision, the algorithm chooses a random number of slot times to wait, from a range of `0` to `2^n - 1`. The range doubles with each collision, up to a maximum (typically 10), after which it remains at its maximum value. This drastically reduces the probability of two stations choosing the same wait time and colliding again.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default CSMACDArticle;
