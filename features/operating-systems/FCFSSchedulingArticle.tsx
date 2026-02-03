
import React from 'react';
import Card from '../../components/ui/Card';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-background-elevated p-4 rounded-md my-4 overflow-x-auto">
    <code className="font-mono text-sm text-text-secondary">{children}</code>
  </pre>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const FCFSSchedulingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>First-Come, First-Serve (FCFS) is the simplest CPU scheduling algorithm. Processes are dispatched according to their arrival time at the ready queue. Being a non-preemptive discipline, once a process has a CPU, it runs to completion.</p>
                <p>It is easy to understand and implement and is based on a simple FIFO (First-In, First-Out) queue. While simple, it's not ideal for time-sharing systems due to its non-preemptive nature and potential for long average waiting times.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Create a ready queue to store processes that have arrived and are waiting for the CPU.</li>
                    <li>Sort the processes based on their arrival time in ascending order.</li>
                    <li>Start with the first process in the sorted list. Allocate the CPU to it.</li>
                    <li>The process runs until it completes (finishes its burst time).</li>
                    <li>While the current process is running, any new processes that arrive are added to the ready queue.</li>
                    <li>Once the current process completes, select the next process from the front of the ready queue.</li>
                    <li>Repeat steps 4-6 until all processes are executed.</li>
                </ol>
            </Section>

             <Section title="Key Metrics">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Arrival Time:</strong> Time at which the process arrives in the ready queue.</li>
                    <li><strong>Burst Time:</strong> Time required by a process for CPU execution.</li>
                    <li><strong>Completion Time:</strong> Time at which the process completes its execution.</li>
                    <li><strong>Turnaround Time:</strong> Time difference between completion time and arrival time. (Turnaround Time = Completion Time - Arrival Time)</li>
                    <li><strong>Waiting Time:</strong> Time difference between turnaround time and burst time. (Waiting Time = Turnaround Time - Burst Time)</li>
                </ul>
            </Section>

            <Section title="Edge Cases & Limitations">
                <p>The primary limitation of FCFS is the <strong>convoy effect</strong>. This occurs when a process with a long burst time arrives before processes with short burst times. The shorter processes get blocked, waiting for the long one to finish, leading to a high average waiting time and low CPU utilization.</p>
                <p>FCFS is a non-preemptive algorithm, meaning it is not suitable for interactive, time-sharing systems where it's important for each user to get a regular share of the CPU time.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Consider three processes P1, P2, and P3 with burst times of 24, 3, and 3 ms, respectively. If they arrive in the order P1, P2, P3, calculate the average waiting time using FCFS. What happens if they arrive in the order P2, P3, P1?</p>
                    <p><strong>2.</strong> Why is FCFS scheduling considered fair in one sense but unfair in another?</p>
                    <p><strong>3.</strong> Can FCFS result in starvation (a process being perpetually denied necessary resources)? Explain why or why not.</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default FCFSSchedulingArticle;
