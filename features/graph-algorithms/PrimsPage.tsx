
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import PrimsArticle from './PrimsArticle';
import PrimsSimulator from './PrimsSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { primsCode } from '../../data/code/graph-algorithms/primsCode';

const PrimsPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <PrimsArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={primsCode} /> },
    { label: 'Interactive Simulator', content: <PrimsSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Prim's Algorithm</h1>
        <p className="text-text-tertiary mt-1">A greedy algorithm to find a Minimum Spanning Tree by growing from a single vertex.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default PrimsPage;
