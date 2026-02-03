
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SCANArticle from './SCANArticle';
import SCANSimulator from './SCANSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { scanDiskCode } from '../../data/code/disk-scheduling/scanDiskCode';

const SCANPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SCANArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={scanDiskCode} /> },
    { label: 'Interactive Simulator', content: <SCANSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">SCAN Disk Scheduling</h1>
        <p className="text-text-tertiary mt-1">The "elevator algorithm" that services requests in one direction before reversing.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SCANPage;
