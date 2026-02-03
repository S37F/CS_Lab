import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SJFSchedulingArticle from './SJFSchedulingArticle';
import SJFSchedulingSimulator from './SJFSchedulingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { sjfSchedulingCode } from '../../data/code/operating-systems/sjfSchedulingCode';

const SJFSchedulingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SJFSchedulingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={sjfSchedulingCode} /> },
    { label: 'Interactive Simulator', content: <SJFSchedulingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Shortest Job First (SJF) Scheduling</h1>
        <p className="text-text-tertiary mt-1">A scheduling policy that selects the waiting process with the smallest execution time to execute next.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SJFSchedulingPage;
