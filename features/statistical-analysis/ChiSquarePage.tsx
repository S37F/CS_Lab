
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ChiSquareArticle from './ChiSquareArticle';
import ChiSquareSimulator from './ChiSquareSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { chiSquareCode } from '../../data/code/statistical-analysis/chiSquareCode';

const ChiSquarePage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ChiSquareArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={chiSquareCode} /> },
    { label: 'Interactive Simulator', content: <ChiSquareSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Chi-Square Test</h1>
        <p className="text-text-tertiary mt-1">Observed vs. Expected frequency analysis.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ChiSquarePage;
