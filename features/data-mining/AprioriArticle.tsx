
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const AprioriArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Apriori algorithm is a classic algorithm used for mining frequent itemsets and learning association rules. It is most famously used for Market Basket Analysis, where the goal is to find relationships between products in large-scale transaction data (e.g., "customers who bought diapers and milk also tend to buy beer").</p>
                <p>The algorithm identifies the frequent individual items in the database and extends them to larger and larger itemsets as long as those itemsets appear sufficiently often in the database.</p>
            </Section>

            <Section title="The Apriori Principle">
                <p>The efficiency of the algorithm is based on the "Apriori principle," which states:</p>
                <blockquote className="border-l-4 border-accent-primary pl-4 italic">
                    If an itemset is frequent, then all of its subsets must also be frequent.
                </blockquote>
                <p>Conversely, if an itemset is infrequent, then all of its supersets must also be infrequent. This principle allows the algorithm to prune a huge number of candidate itemsets, making the search feasible.</p>
            </Section>

            <Section title="Algorithm Steps">
                 <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Set a minimum support threshold (min_sup):</strong> This is the minimum frequency an itemset must have to be considered "frequent".</li>
                    <li><strong>Find frequent 1-itemsets (L1):</strong> Scan the database to count the support of each individual item. Keep only those that meet `min_sup`.</li>
                    <li><strong>Generate Candidate Itemsets (Ck):</strong> From the frequent (k-1)-itemsets (Lk-1), generate candidate k-itemsets. This is done by joining Lk-1 with itself.</li>
                    <li><strong>Prune Candidates:</strong> Using the Apriori principle, discard any candidate k-itemset if one of its (k-1)-subsets is not in Lk-1.</li>
                    <li><strong>Count Support for Candidates:</strong> Scan the database again to count the support of each remaining candidate in Ck.</li>
                    <li><strong>Find Frequent k-itemsets (Lk):</strong> Keep only those candidates from Ck that meet `min_sup`.</li>
                    <li>Repeat steps 3-6 until no new frequent itemsets can be found.</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default AprioriArticle;
