
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ID3Article from './ID3Article';
import ID3Simulator from './ID3Simulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { id3Code } from '../../data/code/data-mining/id3Code';

const ID3Page: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ID3Article /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={id3Code} /> },
    { label: 'Interactive Simulator', content: <ID3Simulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">ID3 Decision Tree</h1>
        <p className="text-text-tertiary mt-1">Tree building using Entropy and Information Gain.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ID3Page;
