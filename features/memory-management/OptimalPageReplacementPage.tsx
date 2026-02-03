import React from 'react';
import Tabs from '../../components/ui/Tabs';
import OptimalPageReplacementArticle from './OptimalPageReplacementArticle';
import OptimalPageReplacementSimulator from './OptimalPageReplacementSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { optimalPageReplacementCode } from '../../data/code/memory-management/optimalPageReplacementCode';

const OptimalPageReplacementPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <OptimalPageReplacementArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={optimalPageReplacementCode} /> },
    { label: 'Interactive Simulator', content: <OptimalPageReplacementSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Optimal Page Replacement</h1>
        <p className="text-text-tertiary mt-1">A "lookahead" algorithm that replaces the page that will not be used for the longest time.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default OptimalPageReplacementPage;
