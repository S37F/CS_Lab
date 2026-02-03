
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const MinimaxArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Minimax is a decision-making algorithm used in two-player, zero-sum games like Tic-Tac-Toe, Chess, and Go. The goal is to find the optimal move for a player, assuming that the opponent also plays optimally.</p>
                <p>It works by exploring a game tree, where nodes represent game states and edges represent moves. The algorithm tries to minimize the possible loss for a worst-case scenario (minimizing the maximum loss).</p>
            </Section>

            <Section title="Maximizer vs. Minimizer">
                <p>The algorithm models the two players as a "maximizer" and a "minimizer."</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Maximizer (Our AI):</strong> Tries to get the highest possible score.</li>
                    <li><strong>Minimizer (The Opponent):</strong> Tries to get the lowest possible score.</li>
                </ul>
                <p>The algorithm recursively explores the game tree down to the terminal nodes (win, lose, or draw states), assigning a score to each. It then works its way back up the tree, with the maximizer choosing the move with the highest score and the minimizer choosing the move with the lowest score at each level.</p>
            </Section>

            <Section title="Alpha-Beta Pruning">
                <p>The basic Minimax algorithm has to explore every node in the game tree, which is computationally expensive. Alpha-Beta Pruning is an optimization that reduces the number of nodes evaluated.</p>
                <p>It works by keeping track of two values:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Alpha:</strong> The best score found so far for the maximizer on the path to the root.</li>
                    <li><strong>Beta:</strong> The best score found so far for the minimizer on the path to the root.</li>
                </ul>
                <p>The algorithm stops evaluating a branch of the game tree as soon as it determines that the current move is worse than a previously examined move. Specifically, if at any point `beta &lt;= alpha`, the current branch can be "pruned" because it won't lead to a better outcome.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default MinimaxArticle;
