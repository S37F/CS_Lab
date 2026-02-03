
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const KMeansArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>K-Means is a popular unsupervised machine learning algorithm used for clustering. It aims to partition a set of data points into 'K' distinct, non-overlapping clusters. Each data point belongs to the cluster with the nearest mean (cluster centroid).</p>
                <p>It's used in many fields, including customer segmentation, document clustering, and image compression.</p>
            </Section>

            <Section title="Algorithm Steps">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Initialization:</strong> Choose the number of clusters, K. Randomly initialize K centroids (the center points of the clusters).</li>
                    <li><strong>Assignment Step:</strong> For each data point, calculate its distance to every centroid. Assign the data point to the cluster of the closest centroid.</li>
                    <li><strong>Update Step:</strong> After all data points have been assigned to a cluster, recalculate the position of each of the K centroids. The new centroid position is the mean of all data points assigned to that cluster.</li>
                    <li><strong>Repeat:</strong> Repeat the Assignment and Update steps until the centroids no longer move significantly, or a maximum number of iterations is reached.</li>
                </ol>
            </Section>
            
            <Section title="Challenges">
                <p>The performance of K-Means depends on the initial placement of centroids. A poor initialization can lead to suboptimal clustering. To mitigate this, the algorithm is often run multiple times with different random initializations.</p>
                <p>Additionally, the number of clusters, K, must be chosen beforehand. It also assumes that clusters are spherical and of similar size, which may not be true for all datasets.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default KMeansArticle;
