import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const ID3Article: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Overview">
                <p>ID3 (Iterative Dichotomiser 3) is an algorithm used to generate a decision tree from a dataset. ID3 is the precursor to the C4.5 algorithm, and is typically used in the machine learning and natural language processing domains.</p>
            </Section>
            <Section title="Entropy and Information Gain">
                <p>ID3 uses Entropy and Information Gain to construct a decision tree. It calculates the entropy of every attribute of the data set, splits the set into subsets using the attribute for which the resulting entropy is minimum or, equivalently, information gain is maximum.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default ID3Article;
