import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const HillClimbingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Overview">
                <p>Hill climbing is a mathematical optimization technique which belongs to the family of local search. It is an iterative algorithm that starts with an arbitrary solution to a problem, then attempts to find a better solution by making an incremental change to the solution. If the change produces a better solution, another incremental change is made to the new solution, and so on until no further improvements can be found.</p>
            </Section>
            <Section title="Key Concepts">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Local Maxima:</strong> A state that is better than all its neighbors but not better than some other states farther away.</li>
                    <li><strong>Plateau:</strong> A flat area of the search space where all neighboring states have the same value.</li>
                    <li><strong>Ridges:</strong> An area of the search space that is higher than surrounding areas, but has a slope (special kind of local maxima).</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default HillClimbingArticle;
