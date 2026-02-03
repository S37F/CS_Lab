
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import NaiveBayesArticle from './NaiveBayesArticle';
import NaiveBayesSimulator from './NaiveBayesSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { naiveBayesCode } from '../../data/code/data-mining/naiveBayesCode';

const NaiveBayesPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <NaiveBayesArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={naiveBayesCode} /> },
    { label: 'Interactive Classifier', content: <NaiveBayesSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Naïve Bayes</h1>
        <p className="text-text-tertiary mt-1">Probability-based prediction.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default NaiveBayesPage;
