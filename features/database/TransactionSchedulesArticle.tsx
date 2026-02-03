import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const TransactionSchedulesArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Recoverable Schedules">
                <p>A recoverable schedule is one where, for any pair of transactions Ti and Tj, if Tj reads a data item previously written by Ti, the commit operation of Ti must appear before the commit operation of Tj. In other words, a transaction should not be allowed to commit until all other transactions whose changes it has read have committed.</p>
                <p>This property is essential to ensure that if a transaction aborts, it does not lead to a state where other committed transactions have read its uncommitted ("dirty") data.</p>
            </Section>

            <Section title="Cascading Aborts">
                <p>A cascading abort (or cascading rollback) is a situation where the failure of a single transaction causes a series of other dependent transactions to be rolled back or aborted. This occurs when one transaction reads the uncommitted data of another transaction.</p>
                 <p>Example: T1 writes A. T2 reads A. T1 then aborts. Since T2 has read data from a failed transaction, T2 must also be aborted. If a third transaction T3 had read data from T2, it too would need to abort, and so on. This is inefficient and undesirable.</p>
            </Section>

            <Section title="Cascadeless Schedules">
                <p>To prevent cascading aborts, we can enforce a stricter condition called a cascadeless schedule (also known as an "avoiding cascading aborts" or ACA schedule). In a cascadeless schedule, for every pair of transactions Ti and Tj, if Tj reads a data item previously written by Ti, the commit operation of Ti must appear before the read operation of Tj.</p>
                <p>This means a transaction is only allowed to read data that has been written by transactions that have already committed. This prevents the "domino effect" of cascading aborts.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default TransactionSchedulesArticle;
