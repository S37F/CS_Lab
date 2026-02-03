
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ParityBitsArticle from './ParityBitsArticle';
import ParityBitsSimulator from './ParityBitsSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { parityBitsCode } from '../../data/code/error-control/parityBitsCode';

const ParityBitsPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ParityBitsArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={parityBitsCode} /> },
    { label: 'Interactive Simulator', content: <ParityBitsSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Parity Bits</h1>
        <p className="text-text-tertiary mt-1">A simple method for detecting single-bit errors in data transmission.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ParityBitsPage;
