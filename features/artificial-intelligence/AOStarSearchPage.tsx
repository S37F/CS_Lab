
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import AOStarSearchArticle from './AOStarSearchArticle';
import AOStarSearchSimulator from './AOStarSearchSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { aoStarSearchCode } from '../../data/code/artificial-intelligence/aoStarSearchCode';

const AOStarSearchPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <AOStarSearchArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={aoStarSearchCode} /> },
    { label: 'Interactive Simulator', content: <AOStarSearchSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">AO* Search</h1>
        <p className="text-text-tertiary mt-1">Problem decomposition on AND-OR graphs.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default AOStarSearchPage;
