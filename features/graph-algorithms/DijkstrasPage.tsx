
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import DijkstrasArticle from './DijkstrasArticle';
import DijkstrasSimulator from './DijkstrasSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { dijkstrasCode } from '../../data/code/graph-algorithms/dijkstrasCode';

const DijkstrasPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <DijkstrasArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={dijkstrasCode} /> },
    { label: 'Interactive Simulator', content: <DijkstrasSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Dijkstra's Algorithm</h1>
        <p className="text-text-tertiary mt-1">An algorithm for finding the shortest paths between nodes in a weighted graph.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DijkstrasPage;
