
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import CFGArticle from './CFGArticle';
import CFGSimulator from './CFGSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { cfgCode } from '../../data/code/automata/cfgCode';

const CFGPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <CFGArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={cfgCode} /> },
    { label: 'Interactive Parser', content: <CFGSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Context-Free Grammars (CFG)</h1>
        <p className="text-text-tertiary mt-1">A formal grammar used to generate all possible strings in a given formal language.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default CFGPage;
