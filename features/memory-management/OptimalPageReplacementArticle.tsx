import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const OptimalPageReplacementArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Optimal Page Replacement algorithm (also known as OPT or the clairvoyant algorithm) is a memory management policy that results in the fewest possible page faults. It works by replacing the page that will not be used for the longest period of time in the future.</p>
                <p>This algorithm is primarily theoretical and used as a benchmark for other replacement algorithms like LRU and FIFO. It cannot be implemented in a real-world general-purpose operating system because it requires future knowledge of the reference string, which is impossible to predict.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>When a page is referenced, check if it's in memory. If so, it's a page hit.</li>
                    <li>If the page is not in memory (a page fault) and there is an empty frame, load the page.</li>
                    <li>If there are no empty frames, the operating system must look ahead at the future sequence of page references.</li>
                    <li>Among the pages currently in memory, find the one that will be referenced furthest in the future (or not at all).</li>
                    <li>Replace that page with the new page.</li>
                </ol>
            </Section>

            <Section title="Significance">
                <p>The main purpose of the OPT algorithm is for comparison studies. By simulating an OPT algorithm on a given reference string, we can determine the lowest possible number of page faults. We can then measure the performance of a practical algorithm (like LRU) by comparing its page fault count to the optimal one. For example, if OPT produces 10 page faults and LRU produces 14, we can quantify LRU's performance overhead.</p>
                <p>Like LRU, the Optimal algorithm is free from Belady's Anomaly.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default OptimalPageReplacementArticle;