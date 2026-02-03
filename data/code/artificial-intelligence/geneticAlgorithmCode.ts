
export const geneticAlgorithmCode = {
    'Python': `import random

TARGET = "CSLab"
POPULATION_SIZE = 100
MUTATION_RATE = 0.01
VALID_GENES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "

def create_individual():
    return "".join(random.choice(VALID_GENES) for _ in range(len(TARGET)))

def calculate_fitness(individual):
    score = 0
    for i in range(len(TARGET)):
        if individual[i] == TARGET[i]:
            score += 1
    return score / len(TARGET)

def crossover(parent1, parent2):
    midpoint = random.randint(0, len(TARGET) - 1)
    return parent1[:midpoint] + parent2[midpoint:]

def mutate(individual):
    individual_list = list(individual)
    for i in range(len(individual_list)):
        if random.random() < MUTATION_RATE:
            individual_list[i] = random.choice(VALID_GENES)
    return "".join(individual_list)

# Main loop
population = [create_individual() for _ in range(POPULATION_SIZE)]
generation = 0

while True:
    generation += 1
    
    # Calculate fitness for all
    fitness_scores = [(calculate_fitness(ind), ind) for ind in population]
    fitness_scores.sort(reverse=True)
    
    best_individual = fitness_scores[0][1]
    print(f"Gen {generation}: {best_individual} (Fitness: {fitness_scores[0][0]:.2f})")
    
    if best_individual == TARGET:
        print("Target reached!")
        break
        
    # Create the next generation
    new_population = [best_individual] # Elitism
    
    # Select parents from the top 50% and create offspring
    mating_pool = [ind for _, ind in fitness_scores[:POPULATION_SIZE // 2]]
    while len(new_population) < POPULATION_SIZE:
        parent1 = random.choice(mating_pool)
        parent2 = random.choice(mating_pool)
        child = crossover(parent1, parent2)
        child = mutate(child)
        new_population.append(child)
        
    population = new_population
`,
    'Java': `// Genetic Algorithm implementation in Java is extensive.
// It requires classes for Individual, Population, and the main algorithm logic.

import java.util.Random;

public class GeneticAlgorithm {

    // An 'Individual' class would store the chromosome (e.g., a string) and its fitness score.
    // A 'Population' class would manage a list of individuals.

    public void run() {
        // 1. Initialize population with random individuals.
        // 2. Loop for a number of generations or until target is met:
        //    a. Calculate fitness for each individual.
        //    b. Create a new population.
        //    c. Selection: Select parents from the old population (e.g., tournament selection).
        //    d. Crossover: Create offspring from pairs of parents.
        //    e. Mutation: Mutate the offspring's genes based on a mutation rate.
        //    f. Replace old population with the new one.
        System.out.println("Full implementation is complex. See Python example.");
    }

    public static void main(String[] args) {
        new GeneticAlgorithm().run();
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>

// Genetic Algorithm implementation in C++ is extensive.
// It requires classes/structs for individuals, population, and genetic operators.

struct Individual {
    std::string chromosome;
    double fitness;
};

class GeneticAlgorithm {
public:
    void run() {
        // 1. Initialize population.
        // 2. Main loop:
        //    a. Evaluate fitness of population.
        //    b. Select parents.
        //    c. Perform crossover.
        //    d. Perform mutation.
        //    e. Create new generation.
        std::cout << "Full implementation is complex. See Python example." << std::endl;
    }
};

int main() {
    GeneticAlgorithm ga;
    ga.run();
    return 0;
}
`
};
