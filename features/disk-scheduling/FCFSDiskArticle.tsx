
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const FCFSDiskArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>First-Come, First-Served (FCFS) is the simplest disk scheduling algorithm. As its name implies, it services disk I/O requests in the exact order that they arrive in the request queue. The primary goal of any disk scheduling algorithm is to minimize seek time, which is the time it takes for the disk's read/write head to move to the correct cylinder (track).</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Maintain a FIFO (First-In, First-Out) queue of disk I/O requests.</li>
                    <li>The read/write head starts at a given initial cylinder.</li>
                    <li>The scheduler takes the first request from the queue.</li>
                    <li>The head moves from its current position to the cylinder of the request. The distance moved is calculated as the absolute difference between the current and target cylinders. This is the seek time for this request.</li>
                    <li>Once the request is serviced, the scheduler takes the next request from the front of the queue and repeats the process.</li>
                    <li>This continues until the request queue is empty. The total head movement is the sum of all individual movements.</li>
                </ol>
            </Section>

            <Section title="Advantages and Disadvantages">
                <p><strong>Advantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Simple:</strong> It is very easy to understand and implement.</li>
                    <li><strong>Fair:</strong> Every request gets a chance to be serviced, and no request will face indefinite postponement (starvation).</li>
                </ul>
                <p><strong>Disadvantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Inefficient:</strong> FCFS does not optimize seek time at all. The head may move back and forth across the disk to service requests that are far apart, even if there are closer requests waiting. This leads to high average seek times and poor performance.</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Suppose a disk queue has requests for I/O to cylinders 98, 183, 37, 122, 14, 124, 65, 67, in that order. The head is initially at cylinder 53. Calculate the total head movement in cylinders.</p>
                    <p><strong>2.</strong> In what scenario would FCFS perform relatively well? When would it perform at its worst?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default FCFSDiskArticle;
