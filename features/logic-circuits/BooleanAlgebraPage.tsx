
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import BooleanAlgebraArticle from './BooleanAlgebraArticle';
import BooleanAlgebraSimulator from './BooleanAlgebraSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { booleanAlgebraCode } from '../../data/code/logic-circuits/booleanAlgebraCode';

const BooleanAlgebraPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <BooleanAlgebraArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={booleanAlgebraCode} /> },
    { label: 'Interactive Simplifier', content: <BooleanAlgebraSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Boolean Algebra Simplifier</h1>
        <p className="text-text-tertiary mt-1">Using algebraic laws to reduce complex logic expressions.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default BooleanAlgebraPage;
