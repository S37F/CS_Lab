
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import HierarchicalClusteringArticle from './HierarchicalClusteringArticle';
import HierarchicalClusteringSimulator from './HierarchicalClusteringSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { hierarchicalClusteringCode } from '../../data/code/data-mining/hierarchicalClusteringCode';

const HierarchicalClusteringPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <HierarchicalClusteringArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={hierarchicalClusteringCode} /> },
    { label: 'Interactive Simulator', content: <HierarchicalClusteringSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Hierarchical Clustering</h1>
        <p className="text-text-tertiary mt-1">Bottom-up merging with Dendrogram visualization.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HierarchicalClusteringPage;
