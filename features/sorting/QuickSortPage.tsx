import React from 'react';
import Tabs from '../../components/ui/Tabs';
import QuickSortArticle from './QuickSortArticle';
import QuickSortSimulator from './QuickSortSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { quickSortCode } from '../../data/code/sorting/quickSortCode';

const QuickSortPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <QuickSortArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={quickSortCode} /> },
    { label: 'Interactive Simulator', content: <QuickSortSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Quick Sort</h1>
        <p className="text-text-tertiary mt-1">An efficient in-place sorting algorithm that uses a divide and conquer strategy.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default QuickSortPage;