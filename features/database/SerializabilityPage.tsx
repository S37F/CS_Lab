
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SerializabilityArticle from './SerializabilityArticle';
import SerializabilitySimulator from './SerializabilitySimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { serializabilityCode } from '../../data/code/database/serializabilityCode';

const SerializabilityPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SerializabilityArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={serializabilityCode} /> },
    { label: 'Interactive Analyzer', content: <SerializabilitySimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Conflict Serializability</h1>
        <p className="text-text-tertiary mt-1">Analyzing transaction schedules to ensure database consistency.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SerializabilityPage;
