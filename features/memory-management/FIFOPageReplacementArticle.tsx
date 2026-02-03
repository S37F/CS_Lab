
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const FIFOPageReplacementArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>The First-In, First-Out (FIFO) page replacement algorithm is a memory management policy used by operating systems. When a page fault occurs and a new page needs to be loaded into memory, FIFO selects the oldest page currently in memory to be replaced. It manages the memory frames as a simple FIFO queue.</p>
                <p>Due to its simplicity, it's easy to implement. However, it's often inefficient because it doesn't consider how frequently or recently a page has been used. An old page might be very important, but FIFO will still replace it if it was the first one loaded.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Maintain a queue of pages currently in memory frames. The queue is ordered by the time of arrival.</li>
                    <li>When a new page is referenced, check if it's already in memory.</li>
                    <li>If the page is present (a "page hit"), no action is needed.</li>
                    <li>If the page is not present (a "page fault"), and there is an empty frame, load the new page into the empty frame and add it to the back of the queue.</li>
                    <li>If there are no empty frames, remove the page at the front of the queue (the oldest page) and load the new page into its frame. Add the new page to the back of the queue.</li>
                </ol>
            </Section>

            <Section title="Edge Cases & Limitations">
                <p>The primary limitation of FIFO is its performance, which is often poor in practice. It can replace frequently used pages simply because they were loaded early.</p>
                <p>A famous problem associated with FIFO is <strong>Belady's Anomaly</strong>. This is a counter-intuitive phenomenon where increasing the number of available memory frames can, in some specific cases, actually increase the number of page faults. Most other algorithms, like LRU, do not suffer from this issue.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Given a memory with 3 frames and the page reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2. How many page faults will occur using the FIFO algorithm?</p>
                    <p><strong>2.</strong> Using the same reference string as above but with 4 frames, how many page faults occur? Does this demonstrate Belady's Anomaly?</p>
                    <p><strong>3.</strong> Why is the FIFO page replacement algorithm rarely used in its pure form in modern operating systems?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default FIFOPageReplacementArticle;
