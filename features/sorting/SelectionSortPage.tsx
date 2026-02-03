import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SelectionSortArticle from './SelectionSortArticle';
import SelectionSortSimulator from './SelectionSortSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { selectionSortCode } from '../../data/code/sorting/selectionSortCode';

const SelectionSortPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SelectionSortArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={selectionSortCode} /> },
    { label: 'Interactive Simulator', content: <SelectionSortSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Selection Sort</h1>
        <p className="text-text-tertiary mt-1">An in-place comparison sorting algorithm.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SelectionSortPage;