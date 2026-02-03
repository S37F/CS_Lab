
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const GeneticAlgorithmArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>A Genetic Algorithm (GA) is a search heuristic inspired by Charles Darwin's theory of natural evolution. This algorithm reflects the process of natural selection where the fittest individuals are selected for reproduction in order to produce offspring of the next generation.</p>
                <p>GAs are commonly used to find high-quality solutions to optimization and search problems that are difficult or time-consuming to solve with other methods.</p>
            </Section>

            <Section title="Core Concepts">
                <p>The algorithm operates on a "population" of "individuals" (or "chromosomes"), where each individual represents a potential solution to the problem.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Initial Population:</strong> The process begins with a set of randomly generated individuals.</li>
                    <li><strong>Fitness Function:</strong> A fitness function is defined to evaluate how good each solution is. Each individual is assigned a fitness score.</li>
                    <li><strong>Selection:</strong> Individuals are selected from the current population to be "parents" for the next generation. Fitter individuals have a higher chance of being selected.</li>
                    <li><strong>Crossover:</strong> This is analogous to reproduction. Pairs of parents are combined to create one or more "offspring." For example, a single-point crossover involves swapping the parts of two parent chromosomes at a random crossover point.</li>
                    <li><strong>Mutation:</strong> A small random tweak is applied to the offspring's chromosome to introduce new genetic material and maintain diversity in the population, preventing premature convergence.</li>
                    <li><strong>New Generation:</strong> The new offspring form the next generation. The process of evaluation, selection, crossover, and mutation is repeated until a termination condition is met (e.g., a satisfactory fitness level has been reached or a maximum number of generations have passed).</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default GeneticAlgorithmArticle;
