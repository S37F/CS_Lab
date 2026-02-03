import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export interface TrainingInstance {
  features: Record<string, string>;
  label: string;
}

export interface TestInstance {
  features: Record<string, string>;
}

export interface ClassProbabilities {
  className: string;
  priorProbability: number;
  likelihoods: Record<string, number>;
  posteriorProbability: number;
  logProbability: number;
}

interface NaiveBayesState {
  trainingData: TrainingInstance[];
  testInstance: TestInstance;
  classCounts: Record<string, number>;
  priorProbabilities: Record<string, number>;
  likelihoods: Record<string, Record<string, Record<string, number>>>;
  classProbabilities: ClassProbabilities[];
  prediction?: string;
  currentFeature?: string;
  currentClass?: string;
}

// Default weather dataset for tennis prediction
export const defaultTrainingData: TrainingInstance[] = [
  { features: { Outlook: 'Sunny', Temperature: 'Hot', Humidity: 'High', Wind: 'Weak' }, label: 'No' },
  { features: { Outlook: 'Sunny', Temperature: 'Hot', Humidity: 'High', Wind: 'Strong' }, label: 'No' },
  { features: { Outlook: 'Overcast', Temperature: 'Hot', Humidity: 'High', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'High', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Rain', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Rain', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Strong' }, label: 'No' },
  { features: { Outlook: 'Overcast', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Strong' }, label: 'Yes' },
  { features: { Outlook: 'Sunny', Temperature: 'Mild', Humidity: 'High', Wind: 'Weak' }, label: 'No' },
  { features: { Outlook: 'Sunny', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'Normal', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Sunny', Temperature: 'Mild', Humidity: 'Normal', Wind: 'Strong' }, label: 'Yes' },
  { features: { Outlook: 'Overcast', Temperature: 'Mild', Humidity: 'High', Wind: 'Strong' }, label: 'Yes' },
  { features: { Outlook: 'Overcast', Temperature: 'Hot', Humidity: 'Normal', Wind: 'Weak' }, label: 'Yes' },
  { features: { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'High', Wind: 'Strong' }, label: 'No' }
];

export const defaultTestInstance: TestInstance = {
  features: { Outlook: 'Sunny', Temperature: 'Cool', Humidity: 'High', Wind: 'Strong' }
};

// Calculate prior probabilities P(Class)
function calculatePriorProbabilities(data: TrainingInstance[]): {
  classCounts: Record<string, number>;
  priorProbabilities: Record<string, number>;
} {
  const classCounts: Record<string, number> = {};
  
  // Count occurrences of each class
  data.forEach(instance => {
    classCounts[instance.label] = (classCounts[instance.label] || 0) + 1;
  });

  // Calculate probabilities
  const totalInstances = data.length;
  const priorProbabilities: Record<string, number> = {};
  
  Object.keys(classCounts).forEach(className => {
    priorProbabilities[className] = classCounts[className] / totalInstances;
  });

  return { classCounts, priorProbabilities };
}

// Calculate likelihoods P(Feature=value|Class) with Laplace smoothing
function calculateLikelihoods(
  data: TrainingInstance[],
  classCounts: Record<string, number>
): Record<string, Record<string, Record<string, number>>> {
  const likelihoods: Record<string, Record<string, Record<string, number>>> = {};

  // Get all feature names
  const featureNames = Object.keys(data[0].features);
  const classes = Object.keys(classCounts);

  classes.forEach(className => {
    likelihoods[className] = {};

    featureNames.forEach(featureName => {
      likelihoods[className][featureName] = {};
      
      // Get all unique values for this feature
      const featureValues = new Set(data.map(d => d.features[featureName]));
      const numUniqueValues = featureValues.size;

      featureValues.forEach(featureValue => {
        // Count instances where feature has this value for this class
        const count = data.filter(
          instance => instance.label === className && instance.features[featureName] === featureValue
        ).length;

        // Laplace smoothing: (count + 1) / (classCount + numUniqueValues)
        likelihoods[className][featureName][featureValue] = 
          (count + 1) / (classCounts[className] + numUniqueValues);
      });
    });
  });

  return likelihoods;
}

// Predict class for a test instance
function predict(
  testInstance: TestInstance,
  priorProbabilities: Record<string, number>,
  likelihoods: Record<string, Record<string, Record<string, number>>>
): ClassProbabilities[] {
  const classes = Object.keys(priorProbabilities);
  const classProbabilities: ClassProbabilities[] = [];

  classes.forEach(className => {
    const priorProb = priorProbabilities[className];
    const featureLikelihoods: Record<string, number> = {};
    let logProb = Math.log(priorProb);

    // Multiply likelihoods for each feature (use log to avoid underflow)
    Object.keys(testInstance.features).forEach(featureName => {
      const featureValue = testInstance.features[featureName];
      const likelihood = likelihoods[className][featureName]?.[featureValue] || 0.0001;
      featureLikelihoods[featureName] = likelihood;
      logProb += Math.log(likelihood);
    });

    classProbabilities.push({
      className,
      priorProbability: priorProb,
      likelihoods: featureLikelihoods,
      posteriorProbability: 0, // Will be normalized later
      logProbability: logProb
    });
  });

  // Normalize probabilities using softmax on log probabilities
  const maxLogProb = Math.max(...classProbabilities.map(cp => cp.logProbability));
  const expProbs = classProbabilities.map(cp => Math.exp(cp.logProbability - maxLogProb));
  const sumExpProbs = expProbs.reduce((sum, p) => sum + p, 0);

  classProbabilities.forEach((cp, idx) => {
    cp.posteriorProbability = expProbs[idx] / sumExpProbs;
  });

  return classProbabilities.sort((a, b) => b.posteriorProbability - a.posteriorProbability);
}

export function getNaiveBayesSimulation(
  trainingData: TrainingInstance[] = defaultTrainingData,
  testInstance: TestInstance = defaultTestInstance
): AlgorithmSimulation {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];

  if (trainingData.length === 0) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: 0,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n * m)',
          space: 'O(k * m * v)'
        }
      }
    };
  }

  // Step 1: Show training data
  steps.push({
    id: 0,
    description: 'Step 1: Loading training dataset',
    state: {
      trainingData,
      testInstance,
      classCounts: {},
      priorProbabilities: {},
      likelihoods: {},
      classProbabilities: []
    },
    metrics: {
      totalInstances: trainingData.length,
      numFeatures: Object.keys(trainingData[0].features).length,
      numClasses: 0
    },
    educational_notes: [
      'Naïve Bayes is a probabilistic classifier based on Bayes\' theorem',
      'It assumes features are conditionally independent given the class',
      `Training data contains ${trainingData.length} instances`
    ]
  });

  // Step 2: Calculate prior probabilities
  const { classCounts, priorProbabilities } = calculatePriorProbabilities(trainingData);
  const classes = Object.keys(classCounts);

  steps.push({
    id: 1,
    description: 'Step 2: Calculate prior probabilities P(Class)',
    state: {
      trainingData,
      testInstance,
      classCounts,
      priorProbabilities,
      likelihoods: {},
      classProbabilities: []
    },
    metrics: {
      totalInstances: trainingData.length,
      numClasses: classes.length,
      classCounts
    },
    educational_notes: [
      'Prior probability = (Number of instances in class) / (Total instances)',
      ...classes.map(c => `P(${c}) = ${classCounts[c]}/${trainingData.length} = ${priorProbabilities[c].toFixed(4)}`),
      'These represent the baseline probabilities before seeing any features'
    ]
  });

  // Step 3: Calculate likelihoods
  const likelihoods = calculateLikelihoods(trainingData, classCounts);

  steps.push({
    id: 2,
    description: 'Step 3: Calculate likelihoods P(Feature|Class) for all features and classes',
    state: {
      trainingData,
      testInstance,
      classCounts,
      priorProbabilities,
      likelihoods,
      classProbabilities: []
    },
    metrics: {
      numLikelihoods: Object.keys(likelihoods).reduce((sum, className) => 
        sum + Object.keys(likelihoods[className]).reduce((fSum, feature) => 
          fSum + Object.keys(likelihoods[className][feature]).length, 0), 0)
    },
    educational_notes: [
      'Likelihood = P(Feature=value|Class)',
      'Calculated using: (count + 1) / (class_count + num_unique_values)',
      'The +1 is Laplace smoothing to handle unseen feature values',
      'This prevents zero probabilities that would make the entire product zero'
    ]
  });

  // Step 4: Show test instance
  steps.push({
    id: 3,
    description: 'Step 4: Test instance to classify',
    state: {
      trainingData,
      testInstance,
      classCounts,
      priorProbabilities,
      likelihoods,
      classProbabilities: []
    },
    metrics: {
      testFeatures: Object.keys(testInstance.features).length
    },
    educational_notes: [
      'Test instance features:',
      ...Object.entries(testInstance.features).map(([feature, value]) => `  ${feature} = ${value}`),
      'We will calculate P(Class|Features) for each class'
    ]
  });

  // Steps 5+: Calculate posterior for each class
  const featureNames = Object.keys(testInstance.features);
  let stepId = 4;

  classes.forEach(className => {
    // Step: Show prior for this class
    steps.push({
      id: stepId++,
      description: `Step ${stepId}: Calculate posterior probability for class "${className}" - Prior`,
      state: {
        trainingData,
        testInstance,
        classCounts,
        priorProbabilities,
        likelihoods,
        classProbabilities: [],
        currentClass: className
      },
      metrics: {
        priorProbability: priorProbabilities[className]
      },
      educational_notes: [
        `Starting with prior probability P(${className}) = ${priorProbabilities[className].toFixed(4)}`,
        'Now we multiply by the likelihood of each feature value'
      ]
    });

    // Steps: Calculate likelihood for each feature
    featureNames.forEach((featureName, idx) => {
      const featureValue = testInstance.features[featureName];
      const likelihood = likelihoods[className][featureName]?.[featureValue] || 0.0001;

      steps.push({
        id: stepId++,
        description: `Step ${stepId}: Likelihood for ${featureName}="${featureValue}" given ${className}`,
        state: {
          trainingData,
          testInstance,
          classCounts,
          priorProbabilities,
          likelihoods,
          classProbabilities: [],
          currentClass: className,
          currentFeature: featureName
        },
        metrics: {
          featureName,
          featureValue,
          likelihood,
          className
        },
        educational_notes: [
          `P(${featureName}="${featureValue}"|${className}) = ${likelihood.toFixed(4)}`,
          `This is the probability of ${featureName}="${featureValue}" among ${className} instances`
        ]
      });
    });
  });

  // Final step: Prediction
  const classProbabilities = predict(testInstance, priorProbabilities, likelihoods);
  const prediction = classProbabilities[0].className;

  steps.push({
    id: stepId++,
    description: `Step ${stepId}: Final classification result`,
    state: {
      trainingData,
      testInstance,
      classCounts,
      priorProbabilities,
      likelihoods,
      classProbabilities,
      prediction
    },
    metrics: {
      prediction,
      confidence: classProbabilities[0].posteriorProbability,
      allProbabilities: classProbabilities
    },
    educational_notes: [
      'Posterior probabilities (normalized):',
      ...classProbabilities.map(cp => 
        `  P(${cp.className}|Features) = ${(cp.posteriorProbability * 100).toFixed(2)}%`
      ),
      '',
      `Prediction: ${prediction} (confidence: ${(classProbabilities[0].posteriorProbability * 100).toFixed(2)}%)`,
      '',
      'The class with highest posterior probability is selected as the prediction'
    ]
  });

  const endTime = performance.now();

  return {
    success: true,
    result: {
      prediction,
      confidence: classProbabilities[0].posteriorProbability,
      classProbabilities
    },
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0,
      complexity: {
        time: 'O(n * m) where n = training instances, m = features',
        space: 'O(k * m * v) where k = classes, v = unique feature values'
      }
    }
  };
}
