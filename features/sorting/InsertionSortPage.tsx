import React from 'react';
import Tabs from '../../components/ui/Tabs';
import InsertionSortArticle from './InsertionSortArticle';
import InsertionSortSimulator from './InsertionSortSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { insertionSortCode } from '../../data/code/sorting/insertionSortCode';

const InsertionSortPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <InsertionSortArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={insertionSortCode} /> },
    { label: 'Interactive Simulator', content: <InsertionSortSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Insertion Sort</h1>
        <p className="text-text-tertiary mt-1">A simple sorting algorithm that builds the final sorted array one item at a time.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default InsertionSortPage;