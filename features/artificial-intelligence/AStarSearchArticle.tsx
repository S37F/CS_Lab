
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const AStarSearchArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>A* (pronounced "A-star") is a graph traversal and path-finding algorithm, which is often used in computer science due to its completeness, optimality, and optimal efficiency. It finds the least-cost path from a given initial node to one goal node (out of one or more possible goals).</p>
                <p>It's widely used in video games for character pathfinding, in mapping applications, and in robotics for motion planning.</p>
            </Section>

            <Section title="The Heuristic Function: f(n) = g(n) + h(n)">
                <p>A* maintains a tree of paths originating at the start node. It extends those paths one edge at a time until its termination criterion is satisfied. At each iteration, it determines which of its paths to extend by using a heuristic function:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>f(n) = g(n) + h(n)</code>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>g(n):</strong> The actual cost of the path from the start node to the current node 'n'.</li>
                    <li><strong>h(n) (the heuristic):</strong> An estimated cost of the cheapest path from 'n' to the goal. The quality of the heuristic is crucial. For A* to be optimal, the heuristic must be "admissible," meaning it never overestimates the actual cost to get to the goal.</li>
                    <li><strong>f(n):</strong> The estimated total cost of the path through node 'n' to the goal. A* always explores the node with the lowest f(n) value first.</li>
                </ul>
            </Section>

            <Section title="Algorithm Steps">
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Initialize an "open list" (priority queue) with the starting node.</li>
                    <li>Initialize a "closed list" (set of visited nodes), initially empty.</li>
                    <li>While the open list is not empty:</li>
                    <ul className="list-disc list-inside ml-4">
                        <li>Find the node with the least f(n) on the open list. This is the current node.</li>
                        <li>If the current node is the goal, stop. The path has been found.</li>
                        <li>Move the current node from the open list to the closed list.</li>
                        <li>For each neighbor of the current node:</li>
                         <ul className="list-disc list-inside ml-8">
                            <li>If the neighbor is in the closed list, ignore it.</li>
                            <li>Calculate the tentative g(n) score for the neighbor.</li>
                            <li>If this path to the neighbor is better than any previous one, record it, update its f(n) score, and add it to the open list if it's not already there.</li>
                        </ul>
                    </ul>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default AStarSearchArticle;
