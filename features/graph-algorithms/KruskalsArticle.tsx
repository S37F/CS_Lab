
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const KruskalsArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>A Minimum Spanning Tree (MST) of a connected, undirected graph is a subgraph that connects all the vertices together, without any cycles and with the minimum possible total edge weight. Kruskal's algorithm is a greedy algorithm that finds an MST for such a graph.</p>
                <p>Applications of MSTs include network design (e.g., laying out fiber optic cables to connect cities with minimum cost), cluster analysis, and image segmentation.</p>
            </Section>

            <Section title="Algorithm Steps">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Create a list of all edges in the graph.</li>
                    <li>Sort the list of edges in non-decreasing order of their weights.</li>
                    <li>Initialize the MST as an empty set.</li>
                    <li>Initialize a Disjoint Set Union (DSU) data structure, with each vertex in its own component.</li>
                    <li>Iterate through the sorted edges:</li>
                    <ul className="list-disc list-inside ml-4">
                        <li>For the current edge (u, v), check if vertices u and v belong to different components using the DSU's 'find' operation.</li>
                        <li>If they are in different components, add the edge to the MST. Then, merge the components of u and v using the DSU's 'union' operation.</li>
                        <li>If they are already in the same component, adding this edge would form a cycle, so discard it.</li>
                    </ul>
                    <li>Continue until the MST has V-1 edges (where V is the number of vertices).</li>
                </ol>
            </Section>

            <Section title="The Disjoint Set Union (DSU) Data Structure">
                <p>The efficiency of Kruskal's algorithm relies heavily on the DSU (also known as Union-Find) data structure. It is used to keep track of the connected components of the graph. It provides two main operations:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Find:</strong> Determine which subset a particular element is in. This can be used for determining if two elements are in the same subset.</li>
                    <li><strong>Union:</strong> Join two subsets into a single subset.</li>
                </ul>
                <p>With optimizations like 'union by rank/size' and 'path compression', DSU operations are nearly constant on average, making it very fast.</p>
            </Section>
            
            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Find the MST for a given weighted graph using Kruskal's algorithm. List the edges in the order they are added to the MST.</p>
                    <p><strong>2.</strong> Why does the greedy approach of always picking the smallest weight edge work for finding the MST?</p>
                    <p><strong>3.</strong> What is the time complexity of Kruskal's algorithm and what part of the algorithm dominates it?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default KruskalsArticle;
