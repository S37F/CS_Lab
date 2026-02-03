
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import IEEE754Article from './IEEE754Article';
import IEEE754Simulator from './IEEE754Simulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { ieee754Code } from '../../data/code/number-systems/ieee754Code';

const IEEE754Page: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <IEEE754Article /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={ieee754Code} /> },
    { label: 'Interactive Calculator', content: <IEEE754Simulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">IEEE-754 Floating-Point Standard</h1>
        <p className="text-text-tertiary mt-1">The common standard for representing floating-point numbers in computing.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default IEEE754Page;
