import React from 'react';
import Tabs from '../../components/ui/Tabs';
import GoBackNARQArticle from './GoBackNARQArticle';
import GoBackNARQSimulator from './GoBackNARQSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { goBackNARQCode } from '../../data/code/computer-networks/goBackNARQCode';

const GoBackNARQPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <GoBackNARQArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={goBackNARQCode} /> },
    { label: 'Interactive Simulator', content: <GoBackNARQSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Go-Back-N ARQ</h1>
        <p className="text-text-tertiary mt-1">Sliding window protocol with cumulative ACKs.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default GoBackNARQPage;
