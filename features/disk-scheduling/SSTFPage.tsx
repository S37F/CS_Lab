
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SSTFArticle from './SSTFArticle';
import SSTFSimulator from './SSTFSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { sstfDiskCode } from '../../data/code/disk-scheduling/sstfDiskCode';

const SSTFPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SSTFArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={sstfDiskCode} /> },
    { label: 'Interactive Simulator', content: <SSTFSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">SSTF Disk Scheduling</h1>
        <p className="text-text-tertiary mt-1">Selects the request with the minimum seek time from the current head position.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SSTFPage;
