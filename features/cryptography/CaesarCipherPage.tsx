import React from 'react';
import Tabs from '../../components/ui/Tabs';
import CaesarCipherArticle from './CaesarCipherArticle';
import CaesarCipherSimulator from './CaesarCipherSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { caesarCipherCode } from '../../data/code/cryptography/caesarCipherCode';

const CaesarCipherPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <CaesarCipherArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={caesarCipherCode} /> },
    { label: 'Interactive Calculator', content: <CaesarCipherSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Caesar Cipher</h1>
        <p className="text-text-tertiary mt-1">One of the simplest and most widely known encryption techniques.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default CaesarCipherPage;