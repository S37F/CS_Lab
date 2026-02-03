
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const DBSCANArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Density-Based Spatial Clustering of Applications with Noise (DBSCAN) is a popular unsupervised clustering algorithm. Unlike K-Means, it does not require the number of clusters to be specified beforehand. It groups together points that are closely packed together (points with many nearby neighbors), marking as outliers points that lie alone in low-density regions.</p>
            </Section>

            <Section title="Core Concepts">
                <p>DBSCAN relies on two key parameters:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Epsilon (ε or `eps`):</strong> The maximum distance between two samples for one to be considered as in the neighborhood of the other.</li>
                    <li><strong>Minimum Points (`min_pts`):</strong> The minimum number of points required to form a dense region (a cluster).</li>
                </ul>
                <p>Based on these parameters, points are classified as:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Core Point:</strong> A point that has at least `min_pts` within its ε-neighborhood (including itself).</li>
                    <li><strong>Border Point:</strong> A point that is within the ε-neighborhood of a core point but does not have `min_pts` itself.</li>
                    <li><strong>Noise Point:</strong> A point that is neither a core point nor a border point.</li>
                </ul>
            </Section>

            <Section title="Advantages">
                <p>DBSCAN can find arbitrarily shaped clusters and is robust to outliers (noise). This makes it more versatile than K-Means, which assumes clusters are spherical.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default DBSCANArticle;
