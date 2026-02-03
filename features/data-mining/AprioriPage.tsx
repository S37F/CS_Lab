
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import AprioriArticle from './AprioriArticle';
import AprioriSimulator from './AprioriSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { aprioriCode } from '../../data/code/data-mining/aprioriCode';

const AprioriPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <AprioriArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={aprioriCode} /> },
    { label: 'Interactive Simulator', content: <AprioriSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Apriori Algorithm</h1>
        <p className="text-text-tertiary mt-1">Finding frequent itemsets in transaction data.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default AprioriPage;
