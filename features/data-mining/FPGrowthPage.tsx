
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import FPGrowthArticle from './FPGrowthArticle';
import FPGrowthSimulator from './FPGrowthSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { fpGrowthCode } from '../../data/code/data-mining/fpGrowthCode';

const FPGrowthPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <FPGrowthArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={fpGrowthCode} /> },
    { label: 'Interactive Simulator', content: <FPGrowthSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">FP-Growth</h1>
        <p className="text-text-tertiary mt-1">Frequent Pattern Tree construction.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default FPGrowthPage;
