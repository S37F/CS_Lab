import React, { useState, useEffect, useCallback } from 'react';
import { 
  getNaiveBayesSimulation, 
  defaultTrainingData, 
  defaultTestInstance,
  type TrainingInstance,
  type TestInstance,
  type ClassProbabilities
} from '../../services/naiveBayesService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const NaiveBayesSimulator: React.FC = () => {
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [testInstance, setTestInstance] = useState<TestInstance>(defaultTestInstance);

  // Feature options for the weather dataset
  const featureOptions = {
    Outlook: ['Sunny', 'Overcast', 'Rain'],
    Temperature: ['Hot', 'Mild', 'Cool'],
    Humidity: ['High', 'Normal'],
    Wind: ['Weak', 'Strong']
  };

  // Run simulation
  const runSimulation = useCallback(() => {
    const simData = getNaiveBayesSimulation(defaultTrainingData, testInstance);
    setSimulation(simData);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [testInstance]);

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
  }, isPlaying ? 1000 : null);

  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

  const handleFeatureChange = (featureName: string, value: string) => {
    setTestInstance(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureName]: value
      }
    }));
  };

  const resetTestInstance = () => {
    setTestInstance(defaultTestInstance);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Training Data">
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-text-secondary">#</th>
                  <th className="text-left p-2 text-text-secondary">Outlook</th>
                  <th className="text-left p-2 text-text-secondary">Temperature</th>
                  <th className="text-left p-2 text-text-secondary">Humidity</th>
                  <th className="text-left p-2 text-text-secondary">Wind</th>
                  <th className="text-left p-2 text-text-secondary font-bold">Play Tennis</th>
                </tr>
              </thead>
              <tbody>
                {defaultTrainingData.map((instance, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-background-elevated">
                    <td className="p-2 text-text-tertiary">{idx + 1}</td>
                    <td className="p-2 text-text-primary">{instance.features.Outlook}</td>
                    <td className="p-2 text-text-primary">{instance.features.Temperature}</td>
                    <td className="p-2 text-text-primary">{instance.features.Humidity}</td>
                    <td className="p-2 text-text-primary">{instance.features.Wind}</td>
                    <td className="p-2 font-bold">
                      <span className={instance.label === 'Yes' ? 'text-green-400' : 'text-red-400'}>
                        {instance.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {stepData && stepData.state.priorProbabilities && Object.keys(stepData.state.priorProbabilities).length > 0 && (
          <Card title="Prior Probabilities">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stepData.state.priorProbabilities).map(([className, prob]) => (
                  <div key={className} className="bg-background-elevated rounded-lg p-4">
                    <div className="text-sm text-text-tertiary mb-2">P({className})</div>
                    <div className="text-2xl font-bold text-accent-primary">
                      {(prob as number).toFixed(4)}
                    </div>
                    <div className="text-xs text-text-tertiary mt-1">
                      {stepData.state.classCounts[className]}/{defaultTrainingData.length} instances
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {stepData && stepData.state.currentClass && stepData.state.currentFeature && (
          <Card title="Likelihood Calculation">
            <div className="p-4">
              <div className="bg-background-elevated rounded-lg p-4">
                <div className="text-lg mb-4">
                  P(<span className="text-accent-primary">{stepData.state.currentFeature}</span>=
                  <span className="text-green-400">{testInstance.features[stepData.state.currentFeature]}</span> | 
                  <span className="text-blue-400">{stepData.state.currentClass}</span>)
                </div>
                <div className="text-3xl font-bold text-accent-primary">
                  {stepData.metrics.likelihood?.toFixed(4)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {stepData && stepData.state.classProbabilities && stepData.state.classProbabilities.length > 0 && (
          <Card title="Posterior Probabilities">
            <div className="p-4 space-y-4">
              {(stepData.state.classProbabilities as ClassProbabilities[]).map((cp, idx) => (
                <div key={idx} className="bg-background-elevated rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-text-primary">
                      {cp.className}
                    </span>
                    <span className="text-2xl font-bold text-accent-primary">
                      {(cp.posteriorProbability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${idx === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${cp.posteriorProbability * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-text-tertiary">
                    Prior: {(cp.priorProbability * 100).toFixed(2)}% × Likelihoods
                  </div>
                </div>
              ))}

              {stepData.state.prediction && (
                <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <div className="text-sm text-text-tertiary mb-1">Final Prediction:</div>
                  <div className="text-2xl font-bold text-green-400">
                    {stepData.state.prediction}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    Confidence: {(stepData.metrics.confidence * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card title="Educational Notes">
          <div className="p-4">
            {stepData?.educational_notes && stepData.educational_notes.length > 0 ? (
              <ul className="space-y-2">
                {stepData.educational_notes.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent-primary mr-2">•</span>
                    <span className="text-sm text-text-secondary font-mono">{note}</span>
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
        <Card title="Test Instance">
          <div className="space-y-4">
            <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
              <div className="text-sm text-text-tertiary mb-2">Instance to Classify</div>
              {Object.entries(featureOptions).map(([featureName, options]) => (
                <div key={featureName} className="mb-3">
                  <label className="text-xs text-text-secondary mb-1 block">
                    {featureName}
                  </label>
                  <select
                    value={testInstance.features[featureName]}
                    onChange={(e) => handleFeatureChange(featureName, e.target.value)}
                    className="w-full px-3 py-2 bg-background-elevated border border-border rounded text-sm text-text-primary"
                  >
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-2 px-4">
              <Button onClick={resetTestInstance} variant="secondary" className="flex-1">
                <RefreshIcon className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={runSimulation} className="flex-1" variant="primary">
                Classify
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Controls">
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

            <div className="border-t border-border pt-4">
              <div className="text-sm text-text-secondary mb-2">Current Step:</div>
              <div className="text-xs text-text-tertiary">
                {stepData?.description}
              </div>
            </div>
          </div>
        </Card>

        {stepData && stepData.state.likelihoods && Object.keys(stepData.state.likelihoods).length > 0 && (
          <Card title="Likelihood Table">
            <div className="p-4 overflow-x-auto">
              <div className="text-xs">
                {Object.entries(stepData.state.likelihoods).map(([className, features]) => (
                  <div key={className} className="mb-4">
                    <div className="font-bold text-text-primary mb-2 sticky left-0">
                      Class: {className}
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-1 text-text-tertiary">Feature</th>
                          <th className="text-left p-1 text-text-tertiary">Value</th>
                          <th className="text-right p-1 text-text-tertiary">P(F|C)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(features as Record<string, Record<string, number>>).map(([feature, values]) => (
                          Object.entries(values).map(([value, prob], idx) => (
                            <tr 
                              key={`${feature}-${value}`} 
                              className={`border-b border-border/30 ${
                                stepData.state.currentFeature === feature && 
                                testInstance.features[feature] === value &&
                                stepData.state.currentClass === className
                                  ? 'bg-accent-primary/20' 
                                  : ''
                              }`}
                            >
                              <td className="p-1 text-text-secondary">{feature}</td>
                              <td className="p-1 text-text-primary">{value}</td>
                              <td className="p-1 text-right text-accent-primary font-mono">
                                {prob.toFixed(4)}
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        <Card title="Algorithm Info">
          <div className="p-4 space-y-3 text-sm">
            <div>
              <div className="text-text-tertiary mb-1">Time Complexity:</div>
              <div className="font-mono text-accent-primary">O(n × m)</div>
              <div className="text-xs text-text-tertiary">
                n = training instances, m = features
              </div>
            </div>
            <div className="border-t border-border pt-2">
              <div className="text-text-tertiary mb-1">Space Complexity:</div>
              <div className="font-mono text-accent-primary">O(k × m × v)</div>
              <div className="text-xs text-text-tertiary">
                k = classes, v = unique values
              </div>
            </div>
            <div className="border-t border-border pt-2">
              <div className="text-text-tertiary mb-1">Key Assumptions:</div>
              <ul className="text-xs text-text-secondary space-y-1 ml-4">
                <li>• Features are conditionally independent</li>
                <li>• All features contribute equally</li>
                <li>• Laplace smoothing applied</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NaiveBayesSimulator;