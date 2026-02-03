
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import RunLengthEncodingArticle from './RunLengthEncodingArticle';
import RunLengthEncodingSimulator from './RunLengthEncodingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { runLengthEncodingCode } from '../../data/code/compression/runLengthEncodingCode';

const RunLengthEncodingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <RunLengthEncodingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={runLengthEncodingCode} /> },
    { label: 'Interactive Encoder/Decoder', content: <RunLengthEncodingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Run-Length Encoding (RLE)</h1>
        <p className="text-text-tertiary mt-1">A simple form of lossless data compression based on sequences of repeating characters.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default RunLengthEncodingPage;
