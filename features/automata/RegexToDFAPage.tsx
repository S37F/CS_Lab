
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import RegexToDFAArticle from './RegexToDFAArticle';
import RegexToDFASimulator from './RegexToDFASimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { regexToDfaCode } from '../../data/code/automata/regexToDfaCode';

const RegexToDFAPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <RegexToDFAArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={regexToDfaCode} /> },
    { label: 'Interactive Converter', content: <RegexToDFASimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Regex to DFA Conversion</h1>
        <p className="text-text-tertiary mt-1">Converting a regular expression into a deterministic finite automaton.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default RegexToDFAPage;
