
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const BFSDFSArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Graph Traversal">
                <p>Graph traversal (or graph search) is the process of visiting each vertex in a graph. Such traversals are classified by the order in which the vertices are visited. The two most common algorithms are Breadth-First Search (BFS) and Depth-First Search (DFS).</p>
            </Section>

            <Section title="Breadth-First Search (BFS)">
                <p>BFS is a traversal algorithm that starts at a source node and explores all of its neighbors at the present depth prior to moving on to the nodes at the next depth level. It uses a <strong>queue</strong> data structure to keep track of the next location to visit.</p>
                <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">Algorithm Steps:</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start by putting the starting node in a queue.</li>
                    <li>Mark the starting node as visited.</li>
                    <li>While the queue is not empty:</li>
                    <ul className="list-disc list-inside ml-4">
                        <li>Dequeue a vertex from the queue. This is the current vertex.</li>
                        <li>For each unvisited neighbor of the current vertex:</li>
                        <ul className="list-disc list-inside ml-8">
                            <li>Mark the neighbor as visited.</li>
                            <li>Enqueue the neighbor.</li>
                        </ul>
                    </ul>
                </ol>
                <p><strong>Applications:</strong> Finding the shortest path in an unweighted graph, web crawlers, finding connected components.</p>
            </Section>

            <Section title="Depth-First Search (DFS)">
                <p>DFS is a traversal algorithm that starts at a source node and explores as far as possible along each branch before backtracking. It uses a <strong>stack</strong> data structure (often implicitly via recursion) to remember where to backtrack to.</p>
                <h3 className="text-xl font-semibold text-text-primary mt-4 mb-2">Algorithm Steps (Recursive):</h3>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Start at a given vertex. Mark it as visited.</li>
                    <li>For each unvisited neighbor of the current vertex:</li>
                     <ul className="list-disc list-inside ml-4">
                        <li>Recursively call the DFS function on that neighbor.</li>
                     </ul>
                 </ol>
                <p><strong>Applications:</strong> Topological sorting, cycle detection in graphs, solving puzzles like mazes.</p>
            </Section>

            <Section title="BFS vs. DFS">
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b border-border p-2 font-semibold">Feature</th>
                            <th className="border-b border-border p-2 font-semibold">BFS</th>
                            <th className="border-b border-border p-2 font-semibold">DFS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b border-border p-2">Data Structure</td>
                            <td className="border-b border-border p-2 font-mono">Queue</td>
                            <td className="border-b border-border p-2 font-mono">Stack</td>
                        </tr>
                         <tr>
                            <td className="border-b border-border p-2">Exploration</td>
                            <td className="border-b border-border p-2">Explores level by level</td>
                            <td className="border-b border-border p-2">Explores branch by branch</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Shortest Path</td>
                            <td className="border-b border-border p-2">Finds shortest path in unweighted graphs</td>
                            <td className="border-b border-border p-2">Can get stuck in a long path</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Space Complexity</td>
                            <td className="border-b border-border p-2 font-mono">O(W) where W is max width of graph</td>
                             <td className="border-b border-border p-2 font-mono">O(H) where H is max height/depth</td>
                        </tr>
                    </tbody>
                </table>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BFSDFSArticle;
