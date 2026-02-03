import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const CSCANArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Circular SCAN (C-SCAN) is a modification of the SCAN algorithm designed to provide a more uniform wait time. Like SCAN, the head moves from one end of the disk to the other, servicing requests along the way. However, when it reaches the other end, it immediately returns to the beginning of the disk without servicing any requests on the return trip, and then starts scanning again.</p>
                <p>This approach treats the cylinders as a circular list that is wrapped around from the last cylinder to the first one.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>The disk arm starts at a given position and moves towards one end (e.g., the highest cylinder).</li>
                    <li>As the arm moves, it services all the requests in its path.</li>
                    <li>When the arm reaches the end of the disk, it does a quick return to the other end (e.g., cylinder 0) without servicing any requests.</li>
                    <li>From the beginning, it starts moving towards the high end again, servicing all requests in its path.</li>
                    <li>This process continues until all requests are handled.</li>
                </ol>
            </Section>

            <Section title="Advantages over SCAN">
                <p>The primary advantage of C-SCAN over SCAN is that it provides a more uniform waiting time. In SCAN, cylinders at the extremities wait longer than those in the middle. C-SCAN mitigates this by ensuring the head always moves in the same direction during service, so no request has to wait for the head to reverse and travel all the way back.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Suppose a disk queue has requests for I/O to cylinders 98, 183, 37, 122, 14, 124, 65, 67. The head is initially at cylinder 53 and is moving towards cylinder 199. Calculate the total head movement using C-SCAN.</p>
                    <p><strong>2.</strong> Explain why C-SCAN has a more uniform wait time distribution than SCAN.</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default CSCANArticle;
