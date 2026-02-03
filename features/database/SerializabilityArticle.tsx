import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SerializabilityArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>In database management, a schedule represents a chronological sequence of operations from one or more transactions. Serializability is a concept that ensures that a non-serial schedule (where transactions are interleaved) is equivalent to some serial schedule (where transactions run one after another). This is crucial for maintaining database consistency and isolation.</p>
                <p>A schedule is said to be <strong>conflict-serializable</strong> if it can be transformed into a serial schedule by swapping non-conflicting operations.</p>
            </Section>

            <Section title="Conflicting Operations">
                <p>Two operations are said to be in conflict if they belong to different transactions, access the same data item, and at least one of them is a write operation. There are three types of conflicts:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Read-Write (RW) Conflict:</strong> Transaction T1 reads a data item, and then transaction T2 writes the same data item.</li>
                    <li><strong>Write-Read (WR) Conflict:</strong> T1 writes a data item, and then T2 reads it.</li>
                    <li><strong>Write-Write (WW) Conflict:</strong> T1 writes a data item, and then T2 writes it again.</li>
                </ul>
                <p>Read-Read operations do not conflict as they do not change the data.</p>
            </Section>

            <Section title="Precedence Graph (Serializability Graph)">
                <p>To test for conflict-serializability, we can construct a directed graph called a precedence graph. The steps are as follows:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Create a node for each transaction in the schedule.</li>
                    <li>For every conflict between an operation in transaction Ti and an operation in transaction Tj (where Ti comes before Tj in the schedule), draw a directed edge from Ti to Tj.</li>
                    <li>The schedule is conflict-serializable if and only if the precedence graph has <strong>no cycles</strong>.</li>
                </ol>
                 <p>If there is no cycle, a serial order of execution can be found by performing a topological sort of the graph.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Consider the schedule S: R1(A); R2(A); W1(A); W2(A). Is this schedule conflict-serializable? Draw the precedence graph.</p>
                    <p><strong>2.</strong> Consider S: R1(A); W1(A); R2(A); W2(A); R1(B); W1(B). Is this schedule serializable?</p>
                    <p><strong>3.</strong> Why does a cycle in the precedence graph indicate that a schedule is not conflict-serializable?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SerializabilityArticle;
