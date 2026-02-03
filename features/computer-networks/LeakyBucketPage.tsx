
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import LeakyBucketArticle from './LeakyBucketArticle';
import LeakyBucketSimulator from './LeakyBucketSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { leakyBucketCode } from '../../data/code/computer-networks/leakyBucketCode';

const LeakyBucketPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <LeakyBucketArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={leakyBucketCode} /> },
    { label: 'Interactive Simulator', content: <LeakyBucketSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Leaky Bucket</h1>
        <p className="text-text-tertiary mt-1">Traffic shaping and rate limiting visualization.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default LeakyBucketPage;
