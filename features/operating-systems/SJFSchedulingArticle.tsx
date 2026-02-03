
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SJFSchedulingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Shortest Job First (SJF) is a scheduling algorithm in which the process with the smallest burst time (CPU execution time) is selected for execution next. The goal of SJF is to minimize the average waiting time for a given set of processes.</p>
                <p>SJF is provably optimal in that it gives the minimum average waiting time. However, its main challenge is knowing the length of the next CPU burst, which is impossible to know in practice and must be predicted.</p>
            </Section>

            <Section title="Non-Preemptive vs. Preemptive SJF">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Non-Preemptive SJF:</strong> Once the CPU is allocated to a process, it cannot be taken away until the process completes its entire CPU burst. If new, shorter processes arrive while a longer one is running, they must wait.</li>
                    <li><strong>Preemptive SJF (Shortest Remaining Time First - SRTF):</strong> If a new process arrives in the ready queue with a CPU burst length that is less than the remaining time of the currently executing process, the CPU is preempted. The new, shorter process is then executed. This version is more responsive but has higher overhead due to context switching.</li>
                </ul>
            </Section>
            
            <Section title="Challenges and Limitations">
                <p>The biggest challenge of SJF is the need to predict the next CPU burst time. This is typically done using an exponential average of previous burst times, but it is never perfectly accurate.</p>
                <p>Another significant issue is the possibility of <strong>starvation</strong> for long processes. If there is a steady stream of short processes arriving, a process with a very long burst time might never get to execute.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Consider 4 processes with Arrival Times (0, 1, 2, 3) and Burst Times (8, 4, 9, 5). Calculate the average waiting time for both non-preemptive SJF and preemptive SJF (SRTF).</p>
                    <p><strong>2.</strong> Why is SJF considered optimal?</p>
                    <p><strong>3.</strong> How can the problem of starvation be addressed in an SJF-like scheduling algorithm?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SJFSchedulingArticle;
