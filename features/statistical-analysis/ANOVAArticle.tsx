import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const ANOVAArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Overview">
                <p>ANOVA (Analysis of Variance) is a statistical technique that determines if three or more means are statistically different from each other. ANOVA checks the impact of one or more factors by comparing the means of different samples.</p>
            </Section>
            <Section title="Null Hypothesis">
                <p>The null hypothesis in ANOVA is valid when all the sample means are equal, or they don't have any significant difference. Thus, they can be considered as a part of a larger set of the population.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default ANOVAArticle;
