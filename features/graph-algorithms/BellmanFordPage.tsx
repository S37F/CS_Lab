
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import BellmanFordArticle from './BellmanFordArticle';
import BellmanFordSimulator from './BellmanFordSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { bellmanFordCode } from '../../data/code/graph-algorithms/bellmanFordCode';

const BellmanFordPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <BellmanFordArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={bellmanFordCode} /> },
    { label: 'Interactive Simulator', content: <BellmanFordSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Bellman-Ford Algorithm</h1>
        <p className="text-text-tertiary mt-1">Finds shortest paths in a weighted graph, even with negative edge weights.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default BellmanFordPage;
