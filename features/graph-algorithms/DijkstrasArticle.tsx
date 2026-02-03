
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const DijkstrasArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Dijkstra's algorithm is a greedy algorithm that finds the shortest path between a given source node and all other nodes in a weighted graph. It works for graphs with non-negative edge weights.</p>
                <p>It is widely used in network routing protocols (e.g., OSPF), GPS systems to find the shortest route between two locations, and in various other problems that can be modeled as finding the shortest path in a graph.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Initialization:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Create a set for visited nodes, initially empty.</li>
                            <li>Assign a tentative distance value to every node: set it to zero for our initial node and to infinity for all other nodes.</li>
                            <li>Set the initial node as current.</li>
                        </ul>
                    </li>
                    <li><strong>Visit Neighbors:</strong> For the current node, consider all of its unvisited neighbors. Calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.</li>
                    <li><strong>Mark as Visited:</strong> After considering all of the unvisited neighbors of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will not be checked again.</li>
                    <li><strong>Select Next Node:</strong> Select the unvisited node that is marked with the smallest tentative distance, and set it as the new "current node".</li>
                    <li><strong>Repeat:</strong> If the destination node has been marked visited, then stop. The algorithm has found the shortest path. Otherwise, repeat from step 2.</li>
                </ol>
            </Section>

            <Section title="Limitations">
                <p>Dijkstra's algorithm cannot be used on graphs with negative edge weights. For such graphs, other algorithms like the Bellman-Ford algorithm must be used. The greedy approach of always choosing the path with the minimum weight locally fails when negative edges can create a shorter path through a node that currently seems "farther" away.</p>
            </Section>
            
            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Find the shortest path from node A to all other nodes in a given weighted graph using Dijkstra's algorithm.</p>
                    <p><strong>2.</strong> Why does Dijkstra's algorithm fail with negative edge weights? Provide a small graph example to demonstrate this failure.</p>
                    <p><strong>3.</strong> How can a priority queue be used to optimize the implementation of Dijkstra's algorithm?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default DijkstrasArticle;
