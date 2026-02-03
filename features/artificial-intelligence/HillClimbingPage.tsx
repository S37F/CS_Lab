
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import HillClimbingArticle from './HillClimbingArticle';
import HillClimbingSimulator from './HillClimbingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { hillClimbingCode } from '../../data/code/artificial-intelligence/hillClimbingCode';

const HillClimbingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <HillClimbingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={hillClimbingCode} /> },
    { label: 'Interactive Simulator', content: <HillClimbingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Hill Climbing</h1>
        <p className="text-text-tertiary mt-1">Optimization showing local maxima problems.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HillClimbingPage;
