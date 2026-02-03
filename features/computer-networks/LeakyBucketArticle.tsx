
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const LeakyBucketArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Leaky Bucket is an algorithm used in packet-switched computer networks for traffic shaping and rate limiting. It is used to control the rate at which data is transmitted, smoothing out bursts of traffic into a steady, constant-rate stream.</p>
                <p>Imagine a bucket with a hole in the bottom. Water (packets) can be poured into the bucket at any rate, but it leaks out through the hole at a constant rate. If the bucket is full, any additional water poured in will overflow and be lost. This analogy perfectly describes the algorithm's behavior.</p>
            </Section>

            <Section title="How It Works">
                <ol className="list-decimal list-inside space-y-2">
                    <li>A finite-sized queue (the "bucket") is maintained.</li>
                    <li>When a packet arrives, it is added to the queue if there is space.</li>
                    <li>If the queue is full, the packet is discarded (or "dropped").</li>
                    <li>Packets are transmitted from the queue at a constant, fixed rate (the "leak rate"), as long as the queue is not empty.</li>
                </ol>
                <p>This simple mechanism ensures that regardless of how bursty the incoming traffic is, the output traffic will always be at a smooth, constant rate.</p>
            </Section>

            <Section title="Applications & Use Cases">
                <p>The Leaky Bucket algorithm is fundamental to Quality of Service (QoS) management in networks.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Traffic Shaping:</strong> Used by routers and switches to ensure that data conforms to a predefined traffic profile.</li>
                    <li><strong>Rate Limiting:</strong> Used by APIs and services to prevent abuse and ensure fair usage by limiting the number of requests a client can make in a given time.</li>
                    <li><strong>Congestion Control:</strong> By smoothing out traffic, it helps prevent network congestion.</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default LeakyBucketArticle;
