
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import HammingCodeArticle from './HammingCodeArticle';
import HammingCodeSimulator from './HammingCodeSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { hammingCodeCode } from '../../data/code/error-control/hammingCodeCode';

const HammingCodePage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <HammingCodeArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={hammingCodeCode} /> },
    { label: 'Interactive Simulator', content: <HammingCodeSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Hamming Codes</h1>
        <p className="text-text-tertiary mt-1">A set of error-correction codes that can detect and correct single-bit errors.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HammingCodePage;
