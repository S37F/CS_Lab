import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const BellmanFordArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra's algorithm, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.</p>
            </Section>

            <Section title="Algorithm Steps">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Initialization:</strong> Initialize the distance to the source node as 0, and all other nodes as infinity (∞).</li>
                    <li><strong>Relax Edges Repeatedly:</strong> For `|V| - 1` times (where `|V|` is the number of vertices), iterate through every edge `(u, v)` with weight `w` in the graph. For each edge, perform a "relaxation" step: if <code>distance(u) + w &lt; distance(v)</code>, then update <code>distance(v) = distance(u) + w</code>.</li>
                    <li><strong>Check for Negative-Weight Cycles:</strong> After `|V| - 1` iterations, perform one final iteration over all edges. If any distance can still be improved, it means the graph contains a negative-weight cycle that is reachable from the source. In this case, a shortest path is not well-defined (as one could loop forever to get a shorter path).</li>
                </ol>
            </Section>
            
            <Section title="Why it Works">
                <p>The algorithm relies on the fact that the longest possible simple path (without cycles) in a graph with `|V|` vertices can have at most `|V| - 1` edges. In the first iteration, it finds all shortest paths of length 1. In the second iteration, it finds all shortest paths of length 2, and so on. After `|V| - 1` iterations, it has found all possible shortest simple paths.</p>
                <p>If the final iteration still finds a shorter path, it must be because a cycle with a negative total weight is being traversed, allowing the path distance to decrease indefinitely.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BellmanFordArticle;