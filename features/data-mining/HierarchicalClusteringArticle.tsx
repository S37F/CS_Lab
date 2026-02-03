import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const HierarchicalClusteringArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Overview">
                <p>Hierarchical clustering is a method of cluster analysis which seeks to build a hierarchy of clusters. Strategies for hierarchical clustering generally fall into two types: Agglomerative (bottom-up) and Divisive (top-down).</p>
            </Section>
            <Section title="Dendrogram">
                <p>The results of hierarchical clustering are usually presented in a dendrogram, which is a tree-like diagram that records the sequences of merges or splits.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default HierarchicalClusteringArticle;
