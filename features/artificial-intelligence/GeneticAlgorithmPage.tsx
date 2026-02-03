
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import GeneticAlgorithmArticle from './GeneticAlgorithmArticle';
import GeneticAlgorithmSimulator from './GeneticAlgorithmSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { geneticAlgorithmCode } from '../../data/code/artificial-intelligence/geneticAlgorithmCode';

const GeneticAlgorithmPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <GeneticAlgorithmArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={geneticAlgorithmCode} /> },
    { label: 'Interactive Simulator', content: <GeneticAlgorithmSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Genetic Algorithm</h1>
        <p className="text-text-tertiary mt-1">Evolution simulation with selection, crossover, and mutation.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default GeneticAlgorithmPage;
