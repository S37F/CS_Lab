
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import DFAAcceptanceArticle from './DFAAcceptanceArticle';
import DFAAcceptanceSimulator from './DFAAcceptanceSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { dfaAcceptanceCode } from '../../data/code/automata/dfaAcceptanceCode';

const DFAAcceptancePage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <DFAAcceptanceArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={dfaAcceptanceCode} /> },
    { label: 'Interactive Simulator', content: <DFAAcceptanceSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">DFA String Acceptance</h1>
        <p className="text-text-tertiary mt-1">Simulating how a Deterministic Finite Automaton processes and accepts or rejects strings.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default DFAAcceptancePage;
