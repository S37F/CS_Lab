
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import SimplePerceptronArticle from './SimplePerceptronArticle';
import SimplePerceptronSimulator from './SimplePerceptronSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { simplePerceptronCode } from '../../data/code/artificial-intelligence/simplePerceptronCode';

const SimplePerceptronPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <SimplePerceptronArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={simplePerceptronCode} /> },
    { label: 'Interactive Simulator', content: <SimplePerceptronSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Simple Perceptron</h1>
        <p className="text-text-tertiary mt-1">Visualizing weight updates and decision boundaries.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SimplePerceptronPage;
