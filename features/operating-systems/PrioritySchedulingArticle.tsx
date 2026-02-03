import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const PrioritySchedulingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Priority Scheduling is a scheduling algorithm where a priority is associated with each process, and the CPU is allocated to the process with the highest priority. Equal-priority processes are typically scheduled in FCFS order.</p>
                <p>Priorities can be defined either internally or externally. Internal priorities are assigned by the OS based on criteria like memory requirements or CPU burst length. External priorities are set by users based on the importance of the job.</p>
            </Section>

            <Section title="Preemptive vs. Non-Preemptive">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Non-Preemptive Priority Scheduling:</strong> Once the CPU is allocated to a process, it is not taken away. The process runs until it completes or blocks.</li>
                    <li><strong>Preemptive Priority Scheduling:</strong> If a new process arrives in the ready queue with a priority higher than the currently running process, the CPU is preempted and allocated to the new higher-priority process.</li>
                </ul>
            </Section>
            
            <Section title="Challenges: Starvation">
                <p>A major problem with priority scheduling algorithms is indefinite blocking, or <strong>starvation</strong>. A process that is ready to run but waiting for the CPU can be considered blocked. A priority scheduling algorithm can leave some low-priority processes waiting indefinitely if there is a steady supply of higher-priority processes.</p>
                <p>A common solution to the problem of starvation is <strong>aging</strong>. Aging is a technique of gradually increasing the priority of processes that wait in the system for a long time. Eventually, the aged process will have a high enough priority to be selected for execution.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default PrioritySchedulingArticle;