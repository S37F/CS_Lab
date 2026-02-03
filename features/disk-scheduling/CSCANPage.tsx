
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import CSCANArticle from './CSCANArticle';
import CSCANSimulator from './CSCANSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { cscanDiskCode } from '../../data/code/disk-scheduling/cscanDiskCode';

const CSCANPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <CSCANArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={cscanDiskCode} /> },
    { label: 'Interactive Simulator', content: <CSCANSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">C-SCAN Disk Scheduling</h1>
        <p className="text-text-tertiary mt-1">Circular SCAN: A variant of SCAN that provides more uniform wait times.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default CSCANPage;
