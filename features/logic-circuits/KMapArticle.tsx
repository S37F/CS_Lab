import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const KMapArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition">
                <p>A Karnaugh map (K-map) is a method of simplifying Boolean algebra expressions. It is a pictorial method used to minimize Boolean expressions without having to use Boolean algebra theorems and equation manipulations. A K-map can be thought of as a special version of a truth table.</p>
            </Section>
            <Section title="Method">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Create a K-map grid for the number of variables (2, 3, or 4 variables are common). The rows and columns are labeled in Gray code sequence (where only one bit changes between adjacent cells).</li>
                    <li>Fill the K-map with 1s corresponding to the minterms (or 0s for maxterms) of the Boolean function.</li>
                    <li>Group adjacent 1s in rectangular groups of 2, 4, 8, etc. The groups should be as large as possible and can wrap around the edges of the map.</li>
                    <li>Write a product term for each group by identifying the variables that do not change within that group.</li>
                    <li>The simplified expression is the sum of these product terms (Sum-of-Products form).</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default KMapArticle;
