
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import NormalizationArticle from './NormalizationArticle';
import NormalizationSimulator from './NormalizationSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { normalizationCode } from '../../data/code/database/normalizationCode';

const NormalizationPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <NormalizationArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={normalizationCode} /> },
    { label: 'Interactive Analyzer', content: <NormalizationSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Database Normalization</h1>
        <p className="text-text-tertiary mt-1">The process of organizing columns and tables to minimize data redundancy.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default NormalizationPage;
