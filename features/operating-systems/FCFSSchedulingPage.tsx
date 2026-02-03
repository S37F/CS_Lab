import React from 'react';
import Tabs from '../../components/ui/Tabs';
import FCFSSchedulingArticle from './FCFSSchedulingArticle';
import FCFSSchedulingSimulator from './FCFSSchedulingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { fcfsSchedulingCode } from '../../data/code/operating-systems/fcfsSchedulingCode';

const FCFSSchedulingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <FCFSSchedulingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={fcfsSchedulingCode} /> },
    { label: 'Interactive Simulator', content: <FCFSSchedulingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">First-Come, First-Serve (FCFS) Scheduling</h1>
        <p className="text-text-tertiary mt-1">A non-preemptive scheduling algorithm that executes processes in the order they arrive.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default FCFSSchedulingPage;