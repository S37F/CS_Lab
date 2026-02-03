
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import KruskalsArticle from './KruskalsArticle';
import KruskalSimulator from './KruskalSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { kruskalsCode } from '../../data/code/graph-algorithms/kruskalsCode';

const KruskalsPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <KruskalsArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={kruskalsCode} /> },
    { label: 'Interactive Simulator', content: <KruskalSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Kruskal's Algorithm</h1>
        <p className="text-text-tertiary mt-1">A greedy algorithm to find a Minimum Spanning Tree (MST) for a weighted, undirected graph.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default KruskalsPage;
