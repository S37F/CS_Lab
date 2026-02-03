
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ANOVAArticle from './ANOVAArticle';
import ANOVASimulator from './ANOVASimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { anovaCode } from '../../data/code/statistical-analysis/anovaCode';

const ANOVAPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ANOVAArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={anovaCode} /> },
    { label: 'Interactive Simulator', content: <ANOVASimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">One-Way ANOVA</h1>
        <p className="text-text-tertiary mt-1">Comparing means across multiple groups.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ANOVAPage;
