import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SCANArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The SCAN algorithm, also known as the "elevator algorithm", is a disk scheduling policy where the disk arm moves in one direction, servicing all requests in its path, until it reaches the end of the disk. Once it hits the end, it reverses direction and continues servicing requests.</p>
                <p>SCAN was developed to overcome the starvation issue of SSTF while still providing better performance than FCFS. It offers a good compromise between fairness and performance.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>The disk arm starts at a given position and moves towards one end of the disk (e.g., towards the highest cylinder number).</li>
                    <li>As the arm moves, it services all the requests in its path.</li>
                    <li>When the arm reaches the end of the disk, it reverses its direction of travel.</li>
                    <li>It then services all the requests in its path as it moves towards the opposite end of the disk.</li>
                    <li>This process repeats until all requests are serviced.</li>
                </ol>
            </Section>

            <Section title="Advantages and Disadvantages">
                <p><strong>Advantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Good Performance:</strong> It provides low average seek times, similar to SSTF.</li>
                    <li><strong>No Starvation:</strong> Since the head is guaranteed to sweep across the entire disk, no request will be postponed indefinitely.</li>
                </ul>
                <p><strong>Disadvantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Unfair Wait Times:</strong> The SCAN algorithm is biased against the cylinders at the ends of the disk. A request that just missed the head will have to wait for the head to travel to the end of the disk, reverse, and come all the way back. This leads to non-uniform wait times.</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Suppose a disk queue has requests for I/O to cylinders 98, 183, 37, 122, 14, 124, 65, 67. The head is initially at cylinder 53 and is moving towards cylinder 199. Calculate the total head movement.</p>
                    <p><strong>2.</strong> How is SCAN an improvement over SSTF in terms of fairness?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SCANArticle;
