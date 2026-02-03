
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import LinearRegressionArticle from './LinearRegressionArticle';
import LinearRegressionSimulator from './LinearRegressionSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { linearRegressionCode } from '../../data/code/statistical-analysis/linearRegressionCode';

const LinearRegressionPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <LinearRegressionArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={linearRegressionCode} /> },
    { label: 'Interactive Simulator', content: <LinearRegressionSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Simple Linear Regression</h1>
        <p className="text-text-tertiary mt-1">Least squares line fitting.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default LinearRegressionPage;
