
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import CSMACDArticle from './CSMACDArticle';
import CSMACDSimulator from './CSMACDSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { csmacdCode } from '../../data/code/computer-networks/csmacdCode';

const CSMACDPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <CSMACDArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={csmacdCode} /> },
    { label: 'Interactive Simulator', content: <CSMACDSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">CSMA/CD</h1>
        <p className="text-text-tertiary mt-1">Collision detection simulation for Ethernet.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default CSMACDPage;
