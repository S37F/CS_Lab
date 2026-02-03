import React from 'react';
import Tabs from '../../components/ui/Tabs';
import StopAndWaitARQArticle from './StopAndWaitARQArticle';
import StopAndWaitARQSimulator from './StopAndWaitARQSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { stopAndWaitARQCode } from '../../data/code/computer-networks/stopAndWaitARQCode';

const StopAndWaitARQPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <StopAndWaitARQArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={stopAndWaitARQCode} /> },
    { label: 'Interactive Simulator', content: <StopAndWaitARQSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Stop-and-Wait ARQ</h1>
        <p className="text-text-tertiary mt-1">Basic flow control with acknowledgments.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default StopAndWaitARQPage;
