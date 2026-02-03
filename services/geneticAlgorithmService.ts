import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export interface Individual {
  chromosome: number[];
  fitness: number;
  id: string;
}

export interface GAParameters {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  selectionMethod: 'roulette' | 'tournament';
  problemType: 'function' | 'binary';
  targetString?: string;
  chromosomeLength?: number;
}

interface GAState {
  population: Individual[];
  generation: number;
  bestIndividual: Individual;
  averageFitness: number;
  worstFitness: number;
  diversity: number;
  selectedParents?: Individual[];
  offspring?: Individual[];
  phase?: 'initial' | 'selection' | 'crossover' | 'mutation' | 'complete';
}

// Fitness function for maximizing f(x) = -x² + 10x
// x is decoded from binary chromosome (0-1023 mapped to 0-10)
function fitnessFunction(chromosome: number[]): number {
  const binary = chromosome.join('');
  const decimal = parseInt(binary, 2);
  const x = (decimal / 1023) * 10; // Map 0-1023 to 0-10
  return Math.max(0, -x * x + 10 * x); // f(x) = -x² + 10x
}

// Fitness function for binary string matching
function binaryMatchFitness(chromosome: number[], target: string): number {
  let matches = 0;
  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i].toString() === target[i]) {
      matches++;
    }
  }
  return matches;
}

// Generate random chromosome
function randomChromosome(length: number): number[] {
  return Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1));
}

// Create initial population
function createInitialPopulation(
  size: number,
  chromosomeLength: number,
  problemType: 'function' | 'binary',
  targetString?: string
): Individual[] {
  const population: Individual[] = [];
  
  for (let i = 0; i < size; i++) {
    const chromosome = randomChromosome(chromosomeLength);
    const fitness = problemType === 'function' 
      ? fitnessFunction(chromosome)
      : binaryMatchFitness(chromosome, targetString || '');
    
    population.push({
      chromosome,
      fitness,
      id: `gen0-ind${i}`
    });
  }
  
  return population;
}

// Roulette wheel selection
function rouletteSelection(population: Individual[]): Individual[] {
  const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
  const selected: Individual[] = [];
  
  for (let i = 0; i < population.length; i++) {
    let random = Math.random() * totalFitness;
    let sum = 0;
    
    for (const individual of population) {
      sum += individual.fitness;
      if (sum >= random) {
        selected.push({ ...individual });
        break;
      }
    }
  }
  
  return selected;
}

// Tournament selection
function tournamentSelection(population: Individual[], tournamentSize: number = 3): Individual[] {
  const selected: Individual[] = [];
  
  for (let i = 0; i < population.length; i++) {
    const tournament: Individual[] = [];
    
    for (let j = 0; j < tournamentSize; j++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    
    // Select the best individual from tournament
    const winner = tournament.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
    
    selected.push({ ...winner });
  }
  
  return selected;
}

// Single-point crossover
function crossover(parent1: Individual, parent2: Individual, rate: number): [number[], number[]] {
  if (Math.random() > rate) {
    return [parent1.chromosome.slice(), parent2.chromosome.slice()];
  }
  
  const crossoverPoint = Math.floor(Math.random() * parent1.chromosome.length);
  
  const offspring1 = [
    ...parent1.chromosome.slice(0, crossoverPoint),
    ...parent2.chromosome.slice(crossoverPoint)
  ];
  
  const offspring2 = [
    ...parent2.chromosome.slice(0, crossoverPoint),
    ...parent1.chromosome.slice(crossoverPoint)
  ];
  
  return [offspring1, offspring2];
}

// Bit-flip mutation
function mutate(chromosome: number[], rate: number): number[] {
  return chromosome.map(gene => {
    if (Math.random() < rate) {
      return gene === 0 ? 1 : 0;
    }
    return gene;
  });
}

// Calculate population diversity (average Hamming distance)
function calculateDiversity(population: Individual[]): number {
  if (population.length < 2) return 0;
  
  let totalDistance = 0;
  let comparisons = 0;
  
  for (let i = 0; i < population.length - 1; i++) {
    for (let j = i + 1; j < population.length; j++) {
      let distance = 0;
      for (let k = 0; k < population[i].chromosome.length; k++) {
        if (population[i].chromosome[k] !== population[j].chromosome[k]) {
          distance++;
        }
      }
      totalDistance += distance;
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalDistance / comparisons : 0;
}

// Get population statistics
function getPopulationStats(population: Individual[]) {
  const fitnesses = population.map(ind => ind.fitness);
  const best = population.reduce((best, ind) => ind.fitness > best.fitness ? ind : best);
  const worst = population.reduce((worst, ind) => ind.fitness < worst.fitness ? ind : worst);
  const average = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
  const diversity = calculateDiversity(population);
  
  return { best, worst: worst.fitness, average, diversity };
}

export function getGeneticAlgorithmSimulation(params: GAParameters): AlgorithmSimulation {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  
  const {
    populationSize,
    generations,
    mutationRate,
    crossoverRate,
    selectionMethod,
    problemType,
    targetString = '1010101010',
    chromosomeLength = problemType === 'function' ? 10 : (targetString?.length || 10)
  } = params;
  
  // Validate parameters
  if (populationSize < 2 || generations < 1) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(g * p * c)',
          space: 'O(p * c)'
        }
      }
    };
  }
  
  // Initialize population
  let population = createInitialPopulation(
    populationSize,
    chromosomeLength,
    problemType,
    targetString
  );
  
  let stats = getPopulationStats(population);
  
  // Initial population step
  steps.push({
    id: 0,
    description: `Initial population of ${populationSize} individuals created`,
    state: {
      population: population.map(ind => ({ ...ind })),
      generation: 0,
      bestIndividual: { ...stats.best },
      averageFitness: stats.average,
      worstFitness: stats.worst,
      diversity: stats.diversity,
      phase: 'initial'
    },
    metrics: {
      generation: 0,
      bestFitness: stats.best.fitness,
      averageFitness: stats.average,
      worstFitness: stats.worst,
      diversity: stats.diversity,
      populationSize
    },
    educational_notes: [
      'Initial population is randomly generated with binary chromosomes',
      problemType === 'function' 
        ? 'Each chromosome represents a value x in [0, 10] for f(x) = -x² + 10x'
        : `Each chromosome is compared to target string: ${targetString}`,
      `Best fitness: ${stats.best.fitness.toFixed(2)}, Average: ${stats.average.toFixed(2)}`
    ]
  });
  
  // Evolution loop
  for (let gen = 1; gen <= generations; gen++) {
    // Selection phase
    const selectedParents = selectionMethod === 'roulette'
      ? rouletteSelection(population)
      : tournamentSelection(population);
    
    stats = getPopulationStats(selectedParents);
    
    steps.push({
      id: steps.length,
      description: `Generation ${gen}: Selection using ${selectionMethod} method`,
      state: {
        population: population.map(ind => ({ ...ind })),
        generation: gen,
        selectedParents: selectedParents.map(ind => ({ ...ind })),
        bestIndividual: { ...stats.best },
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity,
        phase: 'selection'
      },
      metrics: {
        generation: gen,
        bestFitness: stats.best.fitness,
        averageFitness: stats.average,
        selectedCount: selectedParents.length
      },
      educational_notes: [
        selectionMethod === 'roulette'
          ? 'Roulette wheel selection: individuals selected with probability proportional to fitness'
          : 'Tournament selection: best individual from random subsets selected',
        `${selectedParents.length} parents selected for reproduction`
      ]
    });
    
    // Crossover phase
    const offspring: Individual[] = [];
    for (let i = 0; i < selectedParents.length; i += 2) {
      const parent1 = selectedParents[i];
      const parent2 = selectedParents[i + 1] || selectedParents[0];
      
      const [child1Chromosome, child2Chromosome] = crossover(parent1, parent2, crossoverRate);
      
      offspring.push({
        chromosome: child1Chromosome,
        fitness: 0, // Will be calculated after mutation
        id: `gen${gen}-off${i}`
      });
      
      if (i + 1 < selectedParents.length) {
        offspring.push({
          chromosome: child2Chromosome,
          fitness: 0,
          id: `gen${gen}-off${i + 1}`
        });
      }
    }
    
    steps.push({
      id: steps.length,
      description: `Generation ${gen}: Crossover with rate ${(crossoverRate * 100).toFixed(0)}%`,
      state: {
        population: population.map(ind => ({ ...ind })),
        generation: gen,
        selectedParents: selectedParents.map(ind => ({ ...ind })),
        offspring: offspring.map(ind => ({ ...ind })),
        bestIndividual: { ...stats.best },
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity,
        phase: 'crossover'
      },
      metrics: {
        generation: gen,
        offspringCount: offspring.length,
        crossoverRate
      },
      educational_notes: [
        'Single-point crossover: chromosomes split at random point and recombined',
        `${offspring.length} offspring created from selected parents`,
        `Crossover rate ${(crossoverRate * 100).toFixed(0)}% determines probability of crossover`
      ]
    });
    
    // Mutation phase
    const mutatedOffspring = offspring.map((ind, idx) => {
      const mutatedChromosome = mutate(ind.chromosome, mutationRate);
      const fitness = problemType === 'function'
        ? fitnessFunction(mutatedChromosome)
        : binaryMatchFitness(mutatedChromosome, targetString);
      
      return {
        chromosome: mutatedChromosome,
        fitness,
        id: `gen${gen}-ind${idx}`
      };
    });
    
    population = mutatedOffspring.slice(0, populationSize);
    stats = getPopulationStats(population);
    
    steps.push({
      id: steps.length,
      description: `Generation ${gen}: Mutation with rate ${(mutationRate * 100).toFixed(1)}%`,
      state: {
        population: population.map(ind => ({ ...ind })),
        generation: gen,
        bestIndividual: { ...stats.best },
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity,
        phase: 'mutation'
      },
      metrics: {
        generation: gen,
        bestFitness: stats.best.fitness,
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity,
        mutationRate
      },
      educational_notes: [
        'Bit-flip mutation: each gene has a chance to flip from 0 to 1 or vice versa',
        `Mutation rate ${(mutationRate * 100).toFixed(1)}% helps maintain genetic diversity`,
        `New best fitness: ${stats.best.fitness.toFixed(2)}`,
        `Population diversity: ${stats.diversity.toFixed(2)}`
      ]
    });
    
    // Generation complete
    steps.push({
      id: steps.length,
      description: `Generation ${gen} complete - Best fitness: ${stats.best.fitness.toFixed(2)}`,
      state: {
        population: population.map(ind => ({ ...ind })),
        generation: gen,
        bestIndividual: { ...stats.best },
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity,
        phase: 'complete'
      },
      metrics: {
        generation: gen,
        bestFitness: stats.best.fitness,
        averageFitness: stats.average,
        worstFitness: stats.worst,
        diversity: stats.diversity
      },
      educational_notes: [
        `Generation ${gen} summary:`,
        `Best individual: ${stats.best.chromosome.join('')} (fitness: ${stats.best.fitness.toFixed(2)})`,
        problemType === 'function'
          ? `Optimal solution: x ≈ 5, f(5) = 25. Current best represents x ≈ ${((parseInt(stats.best.chromosome.join(''), 2) / 1023) * 10).toFixed(2)}`
          : `Target: ${targetString}, Matches: ${stats.best.fitness}/${chromosomeLength}`,
        `Average fitness improved to ${stats.average.toFixed(2)}`
      ]
    });
  }
  
  const endTime = performance.now();
  const finalStats = getPopulationStats(population);
  
  return {
    success: true,
    result: {
      finalPopulation: population,
      bestIndividual: finalStats.best,
      generations: generations,
      convergenceRate: finalStats.best.fitness,
      problemType
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: (populationSize * chromosomeLength * generations * 8) / (1024 * 1024),
      complexity: {
        time: 'O(g * p * c)',
        space: 'O(p * c)'
      }
    }
  };
}