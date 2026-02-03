
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import LZWArticle from './LZWArticle';
import LZWSimulator from './LZWSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { lzwCompressionCode } from '../../data/code/compression/lzwCompressionCode';

const LZWPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <LZWArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={lzwCompressionCode} /> },
    { label: 'Interactive Simulator', content: <LZWSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">LZW Compression</h1>
        <p className="text-text-tertiary mt-1">A dictionary-based lossless data compression algorithm.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default LZWPage;
