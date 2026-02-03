
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import PrioritySchedulingArticle from './PrioritySchedulingArticle';
import PrioritySchedulingSimulator from './PrioritySchedulingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { prioritySchedulingCode } from '../../data/code/operating-systems/prioritySchedulingCode';

const PrioritySchedulingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <PrioritySchedulingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={prioritySchedulingCode} /> },
    { label: 'Interactive Simulator', content: <PrioritySchedulingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Priority Scheduling</h1>
        <p className="text-text-tertiary mt-1">A scheduling algorithm that selects processes based on their priority.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default PrioritySchedulingPage;
