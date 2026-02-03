
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import DBSCANArticle from './DBSCANArticle';
import DBSCANSimulator from './DBSCANSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { dbscanCode } from '../../data/code/data-mining/dbscanCode';

const DBSCANPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <DBSCANArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={dbscanCode} /> },
    { label: 'Interactive Simulator', content: <DBSCANSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">DBSCAN</h1>
        <p className="text-text-tertiary mt-1">Density-based clustering (handling noise).</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DBSCANPage;
