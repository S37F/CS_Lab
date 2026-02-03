import React from 'react';
import Tabs from '../../components/ui/Tabs';
import BubbleSortArticle from './BubbleSortArticle';
import BubbleSortSimulator from './BubbleSortSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { bubbleSortCode } from '../../data/code/sorting/bubbleSortCode';

const BubbleSortPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <BubbleSortArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={bubbleSortCode} /> },
    { label: 'Interactive Simulator', content: <BubbleSortSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Bubble Sort</h1>
        <p className="text-text-tertiary mt-1">A simple comparison-based sorting algorithm.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default BubbleSortPage;