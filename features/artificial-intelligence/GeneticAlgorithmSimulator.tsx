import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getGeneticAlgorithmSimulation, type Individual, type GAParameters } from '../../services/geneticAlgorithmService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const GeneticAlgorithmSimulator: React.FC = () => {
  // Parameters
  const [populationSize, setPopulationSize] = useState<number>(40);
  const [generations, setGenerations] = useState<number>(20);
  const [mutationRate, setMutationRate] = useState<number>(0.05);
  const [crossoverRate, setCrossoverRate] = useState<number>(0.7);
  const [selectionMethod, setSelectionMethod] = useState<'roulette' | 'tournament'>('tournament');
  const [problemType, setProblemType] = useState<'function' | 'binary'>('function');
  const [targetString, setTargetString] = useState<string>('1010101010');
  
  // Simulation state
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Chart data for fitness tracking
  const [fitnessHistory, setFitnessHistory] = useState<{
    generation: number;
    best: number;
    average: number;
    worst: number;
  }[]>([]);

  // Run simulation
  const runSimulation = useCallback(() => {
    const params: GAParameters = {
      populationSize,
      generations,
      mutationRate,
      crossoverRate,
      selectionMethod,
      problemType,
      targetString: problemType === 'binary' ? targetString : undefined,
      chromosomeLength: problemType === 'function' ? 10 : targetString.length
    };
    
    const simData = getGeneticAlgorithmSimulation(params);
    setSimulation(simData);
    setCurrentStep(0);
    setIsPlaying(false);
    
    // Build fitness history from steps
    const history: typeof fitnessHistory = [];
    simData.steps.forEach(step => {
      if (step.state.phase === 'complete' || step.state.phase === 'initial') {
        history.push({
          generation: step.state.generation,
          best: step.metrics.bestFitness,
          average: step.metrics.averageFitness,
          worst: step.metrics.worstFitness || 0
        });
      }
    });
    setFitnessHistory(history);
  }, [populationSize, generations, mutationRate, crossoverRate, selectionMethod, problemType, targetString]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleStep = (dir: number) => {
    if (!simulation) return;
    const nextStep = currentStep + dir;
    if (nextStep >= 0 && nextStep < simulation.steps.length) {
      setCurrentStep(nextStep);
    }
    setIsPlaying(false);
  };

  useInterval(() => {
    if (isPlaying && simulation && currentStep < simulation.steps.length - 1) {
      handleStep(1);
    } else {
      setIsPlaying(false);
    }
  }, isPlaying ? 600 : null);

  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

  // Calculate chart dimensions
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxFitness = useMemo(() => {
    if (fitnessHistory.length === 0) return 25;
    return Math.max(...fitnessHistory.map(h => h.best), 25);
  }, [fitnessHistory]);

  const getYPosition = (fitness: number) => {
    return padding.top + innerHeight - (fitness / maxFitness) * innerHeight;
  };

  const getXPosition = (index: number) => {
    return padding.left + (index / Math.max(fitnessHistory.length - 1, 1)) * innerWidth;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Population Visualization">
          <div className="p-4">
            {stepData && (
              <div className="space-y-4">
                {/* Population Grid */}
                <div className="bg-background-elevated rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-text-secondary mb-3">
                    {stepData.state.phase === 'initial' && 'Initial Population'}
                    {stepData.state.phase === 'selection' && 'Selected Parents'}
                    {stepData.state.phase === 'crossover' && 'Offspring After Crossover'}
                    {stepData.state.phase === 'mutation' && 'Population After Mutation'}
                    {stepData.state.phase === 'complete' && `Generation ${stepData.state.generation} Complete`}
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto">
                    {(() => {
                      let displayPopulation: Individual[] = [];
                      if (stepData.state.phase === 'selection' && stepData.state.selectedParents) {
                        displayPopulation = stepData.state.selectedParents;
                      } else if (stepData.state.phase === 'crossover' && stepData.state.offspring) {
                        displayPopulation = stepData.state.offspring;
                      } else {
                        displayPopulation = stepData.state.population;
                      }

                      return displayPopulation.map((individual: Individual, idx: number) => {
                        const isBest = stepData.state.bestIndividual && 
                          individual.chromosome.join('') === stepData.state.bestIndividual.chromosome.join('');
                        
                        return (
                          <div
                            key={individual.id || idx}
                            className={`relative p-2 rounded border ${
                              isBest 
                                ? 'border-accent-primary bg-accent-primary/10' 
                                : 'border-border bg-background'
                            }`}
                            title={`Fitness: ${individual.fitness?.toFixed(2) || 'N/A'}`}
                          >
                            <div className="text-[8px] font-mono break-all leading-tight text-text-secondary">
                              {individual.chromosome.join('')}
                            </div>
                            <div className={`text-[10px] font-semibold mt-1 ${
                              isBest ? 'text-accent-primary' : 'text-text-tertiary'
                            }`}>
                              {individual.fitness?.toFixed(2) || 'N/A'}
                            </div>
                            {isBest && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-primary rounded-full border-2 border-background"></div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Best Individual Highlight */}
                {stepData.state.bestIndividual && (
                  <div className="bg-accent-primary/10 border border-accent-primary rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-accent-primary mb-2">
                      Best Individual (Generation {stepData.state.generation})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Chromosome</p>
                        <p className="text-sm font-mono text-text-primary break-all">
                          {stepData.state.bestIndividual.chromosome.join('')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Fitness</p>
                        <p className="text-2xl font-bold text-accent-primary">
                          {stepData.state.bestIndividual.fitness.toFixed(2)}
                        </p>
                      </div>
                      {problemType === 'function' && (
                        <div className="col-span-2">
                          <p className="text-xs text-text-tertiary mb-1">Decoded Value</p>
                          <p className="text-sm text-text-secondary">
                            x ≈ {((parseInt(stepData.state.bestIndividual.chromosome.join(''), 2) / 1023) * 10).toFixed(3)}
                            {' → '}
                            f(x) = {stepData.state.bestIndividual.fitness.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <p className="text-sm text-center font-mono text-text-secondary">
              {stepData?.description}
            </p>
          </div>
        </Card>

        <Card title="Fitness Progression">
          <div className="p-4">
            <div className="bg-background-elevated rounded-lg p-4">
              <svg width={chartWidth} height={chartHeight} className="w-full">
                {/* Y-axis */}
                <line
                  x1={padding.left}
                  y1={padding.top}
                  x2={padding.left}
                  y2={chartHeight - padding.bottom}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                {/* X-axis */}
                <line
                  x1={padding.left}
                  y1={chartHeight - padding.bottom}
                  x2={chartWidth - padding.right}
                  y2={chartHeight - padding.bottom}
                  stroke="#6b7280"
                  strokeWidth="2"
                />

                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                  const value = maxFitness * ratio;
                  const y = padding.top + innerHeight - ratio * innerHeight;
                  return (
                    <g key={ratio}>
                      <line
                        x1={padding.left - 5}
                        y1={y}
                        x2={padding.left}
                        y2={y}
                        stroke="#6b7280"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="text-xs fill-text-tertiary"
                      >
                        {value.toFixed(0)}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis label */}
                <text
                  x={chartWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  className="text-xs fill-text-tertiary"
                >
                  Generation
                </text>

                {/* Y-axis label */}
                <text
                  x={15}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(-90 15 ${chartHeight / 2})`}
                  className="text-xs fill-text-tertiary"
                >
                  Fitness
                </text>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(ratio => {
                  const y = padding.top + innerHeight - ratio * innerHeight;
                  return (
                    <line
                      key={ratio}
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.3"
                      strokeDasharray="4,4"
                    />
                  );
                })}

                {/* Plot lines */}
                {fitnessHistory.length > 1 && (
                  <>
                    {/* Best fitness line */}
                    <polyline
                      points={fitnessHistory
                        .map((h, i) => `${getXPosition(i)},${getYPosition(h.best)}`)
                        .join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    
                    {/* Average fitness line */}
                    <polyline
                      points={fitnessHistory
                        .map((h, i) => `${getXPosition(i)},${getYPosition(h.average)}`)
                        .join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* Worst fitness line */}
                    <polyline
                      points={fitnessHistory
                        .map((h, i) => `${getXPosition(i)},${getYPosition(h.worst)}`)
                        .join(' ')}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      opacity="0.5"
                    />

                    {/* Data points */}
                    {fitnessHistory.map((h, i) => (
                      <g key={i}>
                        <circle cx={getXPosition(i)} cy={getYPosition(h.best)} r="3" fill="#10b981" />
                        <circle cx={getXPosition(i)} cy={getYPosition(h.average)} r="3" fill="#3b82f6" />
                      </g>
                    ))}
                  </>
                )}

                {/* Legend */}
                <g transform={`translate(${chartWidth - 150}, ${padding.top})`}>
                  <rect x="0" y="0" width="12" height="12" fill="#10b981" />
                  <text x="18" y="10" className="text-xs fill-text-secondary">Best</text>
                  
                  <rect x="0" y="20" width="12" height="12" fill="#3b82f6" />
                  <text x="18" y="30" className="text-xs fill-text-secondary">Average</text>
                  
                  <rect x="0" y="40" width="12" height="12" fill="#ef4444" opacity="0.5" />
                  <text x="18" y="50" className="text-xs fill-text-secondary">Worst</text>
                </g>
              </svg>
            </div>
          </div>
        </Card>

        <Card title="Educational Notes">
          <div className="p-4">
            {stepData?.educational_notes && stepData.educational_notes.length > 0 ? (
              <ul className="space-y-2">
                {stepData.educational_notes.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span className="text-sm text-text-secondary">{note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-text-tertiary">No notes available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card title="Algorithm Parameters">
          <div className="space-y-4">
            {/* Problem Type */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Problem Type
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setProblemType('function')}
                  variant={problemType === 'function' ? 'primary' : 'secondary'}
                  className="flex-1"
                >
                  Function Max
                </Button>
                <Button
                  onClick={() => setProblemType('binary')}
                  variant={problemType === 'binary' ? 'primary' : 'secondary'}
                  className="flex-1"
                >
                  Binary Match
                </Button>
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                {problemType === 'function' 
                  ? 'Maximize f(x) = -x² + 10x'
                  : 'Match target binary string'}
              </p>
            </div>

            {/* Target String (only for binary problem) */}
            {problemType === 'binary' && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">
                  Target String
                </label>
                <input
                  type="text"
                  value={targetString}
                  onChange={e => setTargetString(e.target.value.replace(/[^01]/g, ''))}
                  className="w-full px-3 py-2 bg-background-elevated border border-border rounded text-sm font-mono"
                  placeholder="1010101010"
                  maxLength={20}
                />
                <p className="text-xs text-text-tertiary mt-1">Binary string to evolve towards</p>
              </div>
            )}

            {/* Population Size */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Population Size: {populationSize}
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={populationSize}
                onChange={e => setPopulationSize(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Number of individuals per generation</p>
            </div>

            {/* Generations */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Generations: {generations}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={generations}
                onChange={e => setGenerations(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Number of evolution cycles</p>
            </div>

            {/* Mutation Rate */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Mutation Rate: {(mutationRate * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={mutationRate}
                onChange={e => setMutationRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Probability of bit flip per gene</p>
            </div>

            {/* Crossover Rate */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Crossover Rate: {(crossoverRate * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={crossoverRate}
                onChange={e => setCrossoverRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-text-tertiary mt-1">Probability of parent crossover</p>
            </div>

            {/* Selection Method */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Selection Method
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectionMethod('tournament')}
                  variant={selectionMethod === 'tournament' ? 'primary' : 'secondary'}
                  className="flex-1"
                >
                  Tournament
                </Button>
                <Button
                  onClick={() => setSelectionMethod('roulette')}
                  variant={selectionMethod === 'roulette' ? 'primary' : 'secondary'}
                  className="flex-1"
                >
                  Roulette
                </Button>
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                {selectionMethod === 'tournament' 
                  ? 'Best from random subsets'
                  : 'Fitness-proportional selection'}
              </p>
            </div>

            <Button onClick={runSimulation} className="w-full" variant="primary">
              <RefreshIcon className="w-4 h-4 mr-2" />
              Run Evolution
            </Button>
          </div>
        </Card>

        <Card title="Playback Controls">
          <div className="space-y-4">
            <div className="flex items-center justify-around pt-2">
              <Button 
                onClick={() => handleStep(-1)} 
                variant="ghost" 
                size="lg" 
                disabled={currentStep <= 0}
              >
                <StepForwardIcon className="w-5 h-5 transform rotate-180"/>
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)} 
                variant="primary" 
                size="lg"
              >
                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
              </Button>
              <Button 
                onClick={() => handleStep(1)} 
                variant="ghost" 
                size="lg" 
                disabled={!simulation || currentStep >= simulation.steps.length - 1}
              >
                <StepForwardIcon className="w-5 h-5"/>
              </Button>
            </div>

            <div className="text-center text-sm text-text-tertiary">
              Step {currentStep + 1} of {simulation?.steps.length || 0}
            </div>
          </div>
        </Card>

        <Card title="Metrics">
          <div className="space-y-3">
            {stepData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-tertiary">Generation</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {stepData.state.generation}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-tertiary">Best Fitness</span>
                  <span className="text-sm font-semibold text-accent-primary">
                    {stepData.state.bestIndividual?.fitness.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-tertiary">Average Fitness</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {stepData.state.averageFitness?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-tertiary">Population Diversity</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {stepData.state.diversity?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-tertiary">Phase</span>
                  <span className="text-sm font-semibold text-text-primary capitalize">
                    {stepData.state.phase}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeneticAlgorithmSimulator;