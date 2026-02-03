
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import MinimaxArticle from './MinimaxArticle';
import MinimaxSimulator from './MinimaxSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { minimaxCode } from '../../data/code/artificial-intelligence/minimaxCode';

const MinimaxPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <MinimaxArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={minimaxCode} /> },
    { label: 'Interactive Simulator', content: <MinimaxSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Minimax</h1>
        <p className="text-text-tertiary mt-1">Game tree optimization with Alpha-Beta Pruning.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default MinimaxPage;
