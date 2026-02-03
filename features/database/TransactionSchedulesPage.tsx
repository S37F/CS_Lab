
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import TransactionSchedulesArticle from './TransactionSchedulesArticle';
import TransactionSchedulesSimulator from './TransactionSchedulesSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { transactionSchedulesCode } from '../../data/code/database/transactionSchedulesCode';

const TransactionSchedulesPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <TransactionSchedulesArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={transactionSchedulesCode} /> },
    { label: 'Interactive Analyzer', content: <TransactionSchedulesSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Transaction Schedules</h1>
        <p className="text-text-tertiary mt-1">Analyzing schedules for recoverability and cascade-less properties.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default TransactionSchedulesPage;
