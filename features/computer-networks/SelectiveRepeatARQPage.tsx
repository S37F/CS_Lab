
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SelectiveRepeatARQArticle from './SelectiveRepeatARQArticle';
import SelectiveRepeatARQSimulator from './SelectiveRepeatARQSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { selectiveRepeatARQCode } from '../../data/code/computer-networks/selectiveRepeatARQCode';

const SelectiveRepeatARQPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SelectiveRepeatARQArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={selectiveRepeatARQCode} /> },
    { label: 'Interactive Simulator', content: <SelectiveRepeatARQSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Selective Repeat ARQ</h1>
        <p className="text-text-tertiary mt-1">Handling specific frame loss efficiently with individual ACKs.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SelectiveRepeatARQPage;
