
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import HuffmanCodingArticle from './HuffmanCodingArticle';
import HuffmanCodingSimulator from './HuffmanCodingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { huffmanCodingCode } from '../../data/code/compression/huffmanCodingCode';

const HuffmanCodingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <HuffmanCodingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={huffmanCodingCode} /> },
    { label: 'Interactive Simulator', content: <HuffmanCodingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Huffman Coding</h1>
        <p className="text-text-tertiary mt-1">A lossless data compression algorithm using variable-length codes.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HuffmanCodingPage;
