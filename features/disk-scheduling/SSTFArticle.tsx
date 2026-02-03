
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SSTFArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Shortest Seek Time First (SSTF) is a disk scheduling algorithm that selects the request with the minimum seek time from the current head position. In other words, it chooses the pending request closest to the current head position, regardless of the order in which the requests arrived.</p>
                <p>The primary goal of SSTF is to reduce the total head movement compared to FCFS, thereby improving the average response time and throughput.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start with a queue of disk I/O requests and an initial head position.</li>
                    <li>From the current head position, find the distance to all pending requests in the queue.</li>
                    <li>Select the request that is closest to the current head position (i.e., has the minimum seek time).</li>
                    <li>Move the head to the cylinder of the selected request and service it. Add the movement distance to the total.</li>
                    <li>Remove the serviced request from the queue.</li>
                    <li>Repeat from step 2 until the request queue is empty.</li>
                </ol>
            </Section>

            <Section title="Advantages and Disadvantages">
                <p><strong>Advantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Better Performance:</strong> Generally provides better throughput and lower average response time than FCFS because it minimizes seek time.</li>
                </ul>
                <p><strong>Disadvantages:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Starvation:</strong> SSTF is not fair. A request for a cylinder far from the current head position might be repeatedly passed over if there is a steady stream of requests closer to the head. This can lead to indefinite postponement or starvation.</li>
                     <li><strong>High Variance:</strong> While the average response time is lower, the variance of response times can be high, with some requests being serviced very quickly and others waiting for a long time.</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Suppose a disk queue has requests for I/O to cylinders 98, 183, 37, 122, 14, 124, 65, 67. The head is initially at cylinder 53. Calculate the total head movement using SSTF.</p>
                    <p><strong>2.</strong> Compare the result from problem 1 with the FCFS result. What is the percentage improvement?</p>
                    <p><strong>3.</strong> Describe a scenario where SSTF would lead to starvation for a specific request.</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SSTFArticle;
