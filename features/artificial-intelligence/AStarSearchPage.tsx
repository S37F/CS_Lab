
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import AStarSearchArticle from './AStarSearchArticle';
import AStarSearchSimulator from './AStarSearchSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { aStarSearchCode } from '../../data/code/artificial-intelligence/aStarSearchCode';

const AStarSearchPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <AStarSearchArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={aStarSearchCode} /> },
    { label: 'Interactive Simulator', content: <AStarSearchSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">A* Search</h1>
        <p className="text-text-tertiary mt-1">Pathfinding using heuristics (f=g+h).</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default AStarSearchPage;
