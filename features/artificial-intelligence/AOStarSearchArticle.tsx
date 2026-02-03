import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const AOStarSearchArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Overview">
                <p>AO* Search is a best-first search algorithm used for problem decomposition. unlike A* which works on OR graphs, AO* works on AND-OR graphs where a problem can be decomposed into smaller sub-problems.</p>
            </Section>
            <Section title="Applications">
                <p>It is widely used in problem solving, game playing, and automated reasoning systems where problems can be broken down recursively.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default AOStarSearchArticle;
