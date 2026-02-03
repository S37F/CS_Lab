
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ZTestTTestArticle from './ZTestTTestArticle';
import ZTestTTestSimulator from './ZTestTTestSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { zTestTTestCode } from '../../data/code/statistical-analysis/zTestTTestCode';

const ZTestTTestPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ZTestTTestArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={zTestTTestCode} /> },
    { label: 'Interactive Calculator', content: <ZTestTTestSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Z-Test & T-Test</h1>
        <p className="text-text-tertiary mt-1">Visualizing rejection regions and p-values for hypothesis testing.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ZTestTTestPage;
