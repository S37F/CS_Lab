
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import DistanceVectorRoutingArticle from './DistanceVectorRoutingArticle';
import DistanceVectorRoutingSimulator from './DistanceVectorRoutingSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { distanceVectorRoutingCode } from '../../data/code/computer-networks/distanceVectorRoutingCode';

const DistanceVectorRoutingPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <DistanceVectorRoutingArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={distanceVectorRoutingCode} /> },
    { label: 'Interactive Simulator', content: <DistanceVectorRoutingSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Distance Vector Routing</h1>
        <p className="text-text-tertiary mt-1">Distributed routing table updates (Bellman-Ford based).</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DistanceVectorRoutingPage;
