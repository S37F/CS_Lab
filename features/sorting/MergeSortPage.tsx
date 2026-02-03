import React from 'react';
import Tabs from '../../components/ui/Tabs';
import MergeSortArticle from './MergeSortArticle';
import MergeSortSimulator from './MergeSortSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { mergeSortCode } from '../../data/code/sorting/mergeSortCode';

const MergeSortPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <MergeSortArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={mergeSortCode} /> },
    { label: 'Interactive Simulator', content: <MergeSortSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Merge Sort</h1>
        <p className="text-text-tertiary mt-1">An efficient, stable, comparison-based sorting algorithm using the divide and conquer paradigm.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default MergeSortPage;