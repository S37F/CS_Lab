import React from 'react';
import Tabs from '../../components/ui/Tabs';
import TwosComplementArticle from './TwosComplementArticle';
import TwosComplementSimulator from './TwosComplementSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { twosComplementCode } from '../../data/code/number-systems/twosComplementCode';

const TwosComplementPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <TwosComplementArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={twosComplementCode} /> },
    { label: 'Interactive Calculator', content: <TwosComplementSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Two's Complement</h1>
        <p className="text-text-tertiary mt-1">A mathematical operation to represent signed integers in binary.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default TwosComplementPage;
