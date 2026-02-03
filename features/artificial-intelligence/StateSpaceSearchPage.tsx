
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import StateSpaceSearchArticle from './StateSpaceSearchArticle';
import StateSpaceSearchSimulator from './StateSpaceSearchSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { stateSpaceSearchCode } from '../../data/code/artificial-intelligence/stateSpaceSearchCode';

const StateSpaceSearchPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <StateSpaceSearchArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={stateSpaceSearchCode} /> },
    { label: 'Interactive Simulator', content: <StateSpaceSearchSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">BFS/DFS (State Space)</h1>
        <p className="text-text-tertiary mt-1">Visualizing the difference in traversal order for state space search.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default StateSpaceSearchPage;
