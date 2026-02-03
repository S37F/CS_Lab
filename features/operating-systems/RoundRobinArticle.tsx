
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const RoundRobinArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Round Robin (RR) is a CPU scheduling algorithm where each process is assigned a fixed time slot in a cyclic way. It is a preemptive algorithm as processes are switched from the CPU to the ready queue if their time slot expires.</p>
                <p>It is designed especially for time-sharing systems and is similar to FCFS scheduling, but with preemption added to switch between processes. The primary goal is to provide good response time and share the CPU fairly among all active processes.</p>
            </Section>

            <Section title="The Time Quantum">
                <p>A small unit of time, called a <strong>time quantum</strong> or <strong>time slice</strong>, is defined. The ready queue is treated as a circular queue. The CPU scheduler goes around the ready queue, allocating the CPU to each process for a time interval of up to one time quantum.</p>
                <p>The performance of the RR algorithm depends heavily on the size of the time quantum:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Small Time Quantum:</strong> Results in lower waiting and response times, but causes frequent context switches, which adds overhead and lowers CPU efficiency.</li>
                    <li><strong>Large Time Quantum:</strong> Results in fewer context switches, but if the quantum is too large, the RR algorithm degenerates to a First-Come, First-Serve (FCFS) policy.</li>
                </ul>
            </Section>
            
            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                   <li>All arrived processes are maintained in a ready queue, managed as a FIFO queue.</li>
                   <li>The scheduler picks the first process from the ready queue and dispatches it to the CPU.</li>
                   <li>The process runs for a duration equal to the time quantum, or until it finishes its burst time (whichever is smaller).</li>
                   <li>If the process finishes within the quantum, it terminates and is removed from the system. The scheduler then picks the next process from the ready queue.</li>
                   <li>If the process's burst time is longer than the quantum, the timer goes off, and the process is preempted. It is then moved to the tail of the ready queue. The scheduler then picks the next process.</li>
                   <li>This continues until all processes are completed.</li>
                </ol>
            </Section>
            
            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Consider 3 processes P1, P2, P3 with burst times (24, 3, 3) that arrive at the same time. Calculate the average waiting time using Round Robin with a time quantum of 4ms.</p>
                    <p><strong>2.</strong> How does the choice of time quantum affect the performance of Round Robin scheduling?</p>
                    <p><strong>3.</strong> Does Round Robin scheduling suffer from starvation? Why or why not?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default RoundRobinArticle;
