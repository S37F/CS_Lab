
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const StateSpaceSearchArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>State Space Search is a process used in Artificial Intelligence where problems are represented as a state space. A state space is a graph where nodes are states and edges are actions that transform one state into another. The goal is to find a path from an initial state to a goal state.</p>
                <p>Many problems can be solved this way, such as puzzles (like the 8-puzzle or Rubik's Cube), game playing, and pathfinding. The Water Jug problem is a classic example.</p>
            </Section>

            <Section title="The Water Jug Problem">
                <p>You have two unmarked jugs, one with a capacity of 'X' liters and the other 'Y' liters. The goal is to measure out a specific quantity 'Z' of water. The available actions define the transitions between states:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>Fill a jug completely.</li>
                    <li>Empty a jug.</li>
                    <li>Pour water from one jug to another until the second jug is full or the first jug is empty.</li>
                </ul>
                <p>A "state" in this problem is represented by the amount of water in each jug, e.g., (jugX, jugY).</p>
            </Section>
            
            <Section title="Applying Traversal Algorithms">
                <p>Once the problem is defined as a state space, standard graph traversal algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS) can be used to find a solution path.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>BFS:</strong> Explores the state space level by level. It is guaranteed to find the shortest solution path (in terms of number of actions) if one exists. It uses a queue.</li>
                    <li><strong>DFS:</strong> Explores as far as possible down one path before backtracking. It is not guaranteed to find the shortest path but can be more memory-efficient in some cases. It uses a stack (often implicitly via recursion).</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default StateSpaceSearchArticle;
