import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const BankersAlgorithmArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Banker's Algorithm is a deadlock avoidance algorithm developed by Edsger Dijkstra. It tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, then makes a "safe-state" check to test for possible deadlock conditions for all other pending activities, before deciding whether allocation should be allowed to continue.</p>
                <p>The algorithm gets its name because it models how a banker might handle loans: the banker never allocates cash in a way that they can no longer satisfy the needs of all their customers.</p>
            </Section>

            <Section title="Required Data Structures">
                <p>The algorithm requires knowledge of the following:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Available:</strong> A vector indicating the number of available resources of each type.</li>
                    <li><strong>Max:</strong> A matrix defining the maximum demand of each process for each resource type.</li>
                    <li><strong>Allocation:</strong> A matrix defining the number of resources of each type currently allocated to each process.</li>
                    <li><strong>Need:</strong> A matrix indicating the remaining resource need of each process. Calculated as `Need = Max - Allocation`.</li>
                </ul>
            </Section>
            
            <Section title="The Safety Algorithm">
                <p>This algorithm determines if the system is in a safe state. A state is safe if there exists a sequence of processes `(P1, P2, ..., Pn)` such that for each `Pi`, the resources that `Pi` can still request can be satisfied by the currently available resources plus the resources held by all `Pj`, with `j &lt; i`.</p>
                <ol className="list-decimal list-inside space-y-2">
                   <li>Initialize `Work = Available` and `Finish[i] = false` for all processes.</li>
                   <li>Find a process `Pi` such that `Finish[i]` is false and `Need[i] &lt;= Work`. If no such process exists, go to step 4.</li>
                   <li>Update `Work = Work + Allocation[i]`, set `Finish[i] = true`, and append `Pi` to the safe sequence. Go back to step 2.</li>
                   <li>If `Finish[i]` is true for all processes, the system is in a safe state. Otherwise, it is unsafe.</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BankersAlgorithmArticle;