import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const FPGrowthArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>FP-Growth (Frequent Pattern Growth) is an efficient algorithm for mining frequent itemsets without candidate generation. Unlike Apriori, which generates a large number of candidate itemsets, FP-Growth uses a divide-and-conquer strategy and a compact data structure called an FP-tree.</p>
                <p>The algorithm is significantly faster than Apriori, especially on large datasets, because it requires only two database scans and doesn't generate candidate itemsets.</p>
            </Section>

            <Section title="Key Data Structure: FP-Tree">
                <p>The FP-tree (Frequent Pattern tree) is a compressed representation of the database. It has the following properties:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>The root node represents null</li>
                    <li>Each node contains an item, its count, and links to its children and parent</li>
                    <li>Nodes with the same item are linked together via node-link pointers</li>
                    <li>Items are ordered by their frequency (most frequent items closer to the root)</li>
                </ul>
                <p>This structure allows the algorithm to find all frequent patterns without generating candidate itemsets.</p>
            </Section>

            <Section title="Algorithm Steps">
                 <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Scan the database:</strong> Count the support of each item and identify frequent items (items that meet minimum support threshold).</li>
                    <li><strong>Sort frequent items:</strong> Order them by descending support count.</li>
                    <li><strong>Build the FP-tree:</strong> For each transaction:
                        <ul className="list-disc list-inside ml-4">
                            <li>Filter and sort items according to the frequency order</li>
                            <li>Insert the sorted items into the FP-tree, sharing common prefixes</li>
                            <li>Update node counts and node-links</li>
                        </ul>
                    </li>
                    <li><strong>Mine the FP-tree:</strong> For each frequent item (starting from least frequent):
                        <ul className="list-disc list-inside ml-4">
                            <li>Generate its conditional pattern base</li>
                            <li>Construct its conditional FP-tree</li>
                            <li>Recursively mine the conditional FP-tree</li>
                        </ul>
                    </li>
                </ol>
            </Section>

            <Section title="Advantages over Apriori">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>No candidate generation:</strong> FP-Growth never generates candidate itemsets, saving significant time and memory.</li>
                    <li><strong>Compact representation:</strong> The FP-tree is much more compact than the original database.</li>
                    <li><strong>Only two database scans:</strong> One to count frequencies, one to build the tree.</li>
                    <li><strong>Divide and conquer:</strong> The recursive mining process breaks the problem into smaller subproblems.</li>
                </ul>
            </Section>

            <Section title="Time Complexity">
                <p>The time complexity of FP-Growth depends on the structure of the data:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Best case:</strong> O(n) where n is the number of transactions, when there are few distinct frequent patterns.</li>
                    <li><strong>Worst case:</strong> Can be exponential if every transaction is unique and all items are frequent.</li>
                    <li><strong>Average case:</strong> Much faster than Apriori on typical datasets due to the compact tree structure.</li>
                </ul>
            </Section>

            <Section title="Applications">
                <ul className="list-disc list-inside space-y-2">
                    <li>Market basket analysis and recommendation systems</li>
                    <li>Bioinformatics for finding patterns in DNA sequences</li>
                    <li>Web usage mining to discover user navigation patterns</li>
                    <li>Text mining for discovering word associations</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default FPGrowthArticle;
