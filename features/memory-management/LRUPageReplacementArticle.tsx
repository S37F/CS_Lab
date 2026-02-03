
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const LRUPageReplacementArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>The Least Recently Used (LRU) page replacement algorithm is a memory management policy that replaces the page in memory that has not been used for the longest period. It operates on the principle of locality of reference, which suggests that a page that has been recently accessed is likely to be accessed again soon.</p>
                <p>LRU is a very common and effective algorithm. It is used in many operating systems for managing virtual memory and is also the core principle behind many caching systems, such as web browser caches and database buffer caches.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Maintain a list or timestamp for each page in memory to track its last access time.</li>
                    <li>When a new page is referenced, check if it's already in memory.</li>
                    <li>If the page is present (a "page hit"), update its timestamp or move it to the "most recently used" position.</li>
                    <li>If the page is not present (a "page fault"), and there is an empty frame, load the new page into the frame and mark it as the most recently used.</li>
                    <li>If there are no empty frames, identify the page that has been unused for the longest time (the one with the oldest timestamp or at the "least recently used" position) and replace it with the new page. Mark the new page as the most recently used.</li>
                </ol>
            </Section>

            <Section title="Advantages over FIFO">
                <p>LRU is generally more efficient than FIFO because it considers usage patterns. It avoids replacing a page that was loaded a long time ago but is still being actively used.</p>
                <p>Crucially, LRU does not suffer from <strong>Belady's Anomaly</strong>. Increasing the number of available memory frames will always result in an equal or lower number of page faults, which is the expected and desired behavior.</p>
            </Section>

             <Section title="Implementation">
                <p>Implementing a true LRU algorithm can be complex. Two common approaches are:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Counters:</strong> Each page table entry has a time-of-use field. The CPU also has a logical clock. Every time a page is accessed, the clock value is copied to the page's time-of-use field. When a page needs to be replaced, the OS searches for the page with the smallest timestamp.</li>
                    <li><strong>Stack:</strong> A stack of page numbers is maintained. Whenever a page is referenced, it is removed from the stack and put on the top. This way, the most recently used page is always at the top and the least recently used is always at the bottom.</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Given a memory with 3 frames and the page reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2. How many page faults will occur using the LRU algorithm? Compare this to FIFO.</p>
                    <p><strong>2.</strong> Why is a pure LRU implementation expensive in terms of hardware support?</p>
                    <p><strong>3.</strong> Describe an approximation of LRU that is commonly used in real operating systems (e.g., the Second-Chance or Clock algorithm).</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default LRUPageReplacementArticle;
