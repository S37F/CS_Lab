
import React, { useState, useEffect, useCallback } from 'react';
import { getAprioriSimulation } from '../../services/aprioriService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const AprioriSimulator: React.FC = () => {
  const [transactionsInput, setTransactionsInput] = useState<string>('milk,bread,butter\nbread,eggs\nmilk,bread,eggs,butter\nmilk,bread\nbread,butter');
  const [minSupport, setMinSupport] = useState<number>(0.4);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const runSimulation = useCallback(() => {
    const transactions = transactionsInput.split('\n').map(line => 
      line.split(',').map(item => item.trim()).filter(item => item.length > 0)
    ).filter(t => t.length > 0);
    
    if (transactions.length > 0 && minSupport > 0 && minSupport <= 1) {
      const simData = getAprioriSimulation(transactions, minSupport);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [transactionsInput, minSupport]);

  useEffect(() => { runSimulation(); }, [runSimulation]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Frequent Itemsets">
          <div className="p-4">
            {stepData && (
              <div className="space-y-4">
                <div className="bg-background-elevated p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-accent-primary mb-2">
                    {stepData.state.currentLevel === 0 ? 'Scanning Database' : `Finding L${stepData.state.currentLevel} (Frequent ${stepData.state.currentLevel}-itemsets)`}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {stepData.state.currentCandidates?.map((itemset: any, idx: number) => (
                      <div key={idx} className={`p-2 rounded text-center text-sm ${
                        stepData.state.frequentItemsets?.some((f: any) => 
                          JSON.stringify(f.items.sort()) === JSON.stringify([...itemset].sort())
                        ) ? 'bg-green-900/30 border border-green-500 text-green-300' : 
                        'bg-gray-800 border border-gray-600 text-gray-400'
                      }`}>
                        {'{' + itemset.join(', ') + '}'}
                        <div className="text-xs mt-1">
                          {stepData.state.supports?.[JSON.stringify(itemset.sort())] !== undefined 
                            ? `Sup: ${(stepData.state.supports[JSON.stringify(itemset.sort())] * 100).toFixed(0)}%`
                            : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <p className="text-sm text-center font-mono text-text-secondary">{stepData?.description}</p>
          </div>
        </Card>

        <Card title="All Frequent Itemsets Found">
          <div className="p-4 max-h-64 overflow-y-auto">
            {stepData?.state.frequentItemsets && stepData.state.frequentItemsets.length > 0 ? (
              <div className="space-y-2">
                {stepData.state.frequentItemsets.map((itemset: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-background-elevated p-2 rounded">
                    <span className="font-mono text-sm">
                      {'{' + itemset.items.join(', ') + '}'}
                    </span>
                    <span className="text-xs text-accent-primary">
                      Support: {(itemset.support * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-tertiary">No frequent itemsets found yet</p>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card title="Controls">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Transactions (one per line)</label>
              <textarea 
                value={transactionsInput}
                onChange={e => setTransactionsInput(e.target.value)}
                className="w-full h-32 bg-background-elevated border border-border rounded p-2 text-sm font-mono text-text-primary"
                placeholder="item1,item2,item3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">
                Minimum Support: {(minSupport * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={minSupport}
                onChange={e => setMinSupport(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <Button onClick={runSimulation} className="w-full">Run Simulation</Button>
            <div className="flex items-center justify-around pt-2">
              <Button onClick={() => handleStep(-1)} variant="ghost" size="lg" disabled={currentStep <= 0}>
                <StepForwardIcon className="w-5 h-5 transform rotate-180"/>
              </Button>
              <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" size="lg">
                {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
              </Button>
              <Button onClick={() => handleStep(1)} variant="ghost" size="lg" disabled={!simulation || currentStep >= simulation.steps.length - 1}>
                <StepForwardIcon className="w-5 h-5"/>
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Statistics">
          {stepData && (
            <div className="font-mono text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Total Transactions:</span>
                <span className="text-text-primary">{stepData.state.totalTransactions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Min Support Count:</span>
                <span className="text-text-primary">{stepData.state.minSupportCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Current Level:</span>
                <span className="text-text-primary">L{stepData.state.currentLevel || 0}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-text-tertiary">Frequent Itemsets:</span>
                <span className="text-accent-primary">{stepData.state.frequentItemsets?.length || 0}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AprioriSimulator;
