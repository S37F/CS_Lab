import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const PrimsArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Prim's algorithm is a greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.</p>
                <p>The algorithm works by growing a single tree from an arbitrary starting vertex, one edge at a time, until it spans all vertices.</p>
            </Section>

            <Section title="Algorithm Steps">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Initialize the MST with an arbitrary starting vertex.</li>
                    <li>Maintain a set of all edges that connect a vertex in the MST to a vertex outside the MST. This set is often managed with a priority queue.</li>
                    <li>While the MST does not yet include all vertices in the graph:</li>
                    <ul className="list-disc list-inside ml-4">
                        <li>Select the edge with the minimum weight from the set of connecting edges.</li>
                        <li>Add this edge and the new vertex it connects to the MST.</li>
                        <li>Update the set of connecting edges: add any new edges from the newly added vertex to vertices not yet in the MST, and remove any edges that now lead to vertices already in the MST.</li>
                    </ul>
                </ol>
            </Section>

            <Section title="Prim's vs. Kruskal's">
                <p>Both Prim's and Kruskal's are greedy algorithms for finding MSTs, but they have different strategies:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Prim's Algorithm:</strong> Starts from one vertex and grows the MST by adding adjacent vertices. The result is always a connected tree at every stage.</li>
                    <li><strong>Kruskal's Algorithm:</strong> Sorts all edges and adds the next cheapest edge as long as it doesn't form a cycle. The result may be a forest of disconnected trees until the final steps.</li>
                </ul>
                <p>The choice between them often depends on the graph's density. Prim's is generally faster for dense graphs, while Kruskal's is better for sparse graphs.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default PrimsArticle;