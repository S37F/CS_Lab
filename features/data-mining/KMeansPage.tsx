
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import KMeansArticle from './KMeansArticle';
import KMeansSimulator from './KMeansSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { kMeansCode } from '../../data/code/data-mining/kMeansCode';

const KMeansPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <KMeansArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={kMeansCode} /> },
    { label: 'Interactive Simulator', content: <KMeansSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">K-Means Clustering</h1>
        <p className="text-text-tertiary mt-1">Centroid-based partitioning.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default KMeansPage;
