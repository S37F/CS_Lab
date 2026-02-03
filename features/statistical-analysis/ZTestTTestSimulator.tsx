import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon, StepForwardIcon } from '../../components/Icons';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import { getZTestSimulation, getTTestSimulation, ZTestInput, TTestInput } from '../../services/zTestTTestService';
import { AlgorithmSimulation } from '../../types';
import { useInterval } from '../../hooks/useInterval';

type TestType = 'two-tailed' | 'left-tailed' | 'right-tailed';

export default function ZTestTTestSimulator() {
  const [testMode, setTestMode] = useState<'z-test' | 't-test'>('z-test');
  const [sampleDataInput, setSampleDataInput] = useState('100, 102, 98, 105, 99, 103, 97, 101, 104, 100');
  const [mu0, setMu0] = useState('100');
  const [sigma, setSigma] = useState('3');
  const [alpha, setAlpha] = useState<number>(0.05);
  const [testType, setTestType] = useState<TestType>('two-tailed');
  
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = () => {
    const sampleData = sampleDataInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    
    if (sampleData.length === 0) {
      alert('Please enter valid sample data');
      return;
    }
    
    const mu0Val = parseFloat(mu0);
    if (isNaN(mu0Val)) {
      alert('Please enter a valid hypothesized mean');
      return;
    }
    
    let result: AlgorithmSimulation;
    
    if (testMode === 'z-test') {
      const sigmaVal = parseFloat(sigma);
      if (isNaN(sigmaVal) || sigmaVal <= 0) {
        alert('Please enter a valid population standard deviation');
        return;
      }
      
      const input: ZTestInput = {
        sampleData,
        mu0: mu0Val,
        sigma: sigmaVal,
        alpha,
        testType,
      };
      
      result = getZTestSimulation(input);
    } else {
      const input: TTestInput = {
        sampleData,
        mu0: mu0Val,
        alpha,
        testType,
      };
      
      result = getTTestSimulation(input);
    }
    
    setSimulation(result);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useInterval(
    () => {
      if (simulation && currentStep < simulation.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    },
    isPlaying ? 2000 : null
  );

  const handlePlayPause = () => {
    if (simulation && currentStep === simulation.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (simulation && currentStep < simulation.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Normal distribution PDF
  const normalPDF = (x: number, mean: number = 0, stdDev: number = 1) => {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  // T-distribution PDF (approximation)
  const tPDF = (x: number, df: number) => {
    const numerator = Math.pow(1 + (x * x) / df, -(df + 1) / 2);
    const denominator = Math.sqrt(df * Math.PI) * gamma((df + 1) / 2) / gamma(df / 2);
    return numerator / denominator;
  };

  // Gamma function (approximation)
  const gamma = (n: number): number => {
    if (n === 0.5) return Math.sqrt(Math.PI);
    if (n === 1) return 1;
    if (n === 1.5) return Math.sqrt(Math.PI) / 2;
    if (n > 1) return (n - 1) * gamma(n - 1);
    
    // Stirling's approximation
    return Math.sqrt(2 * Math.PI / n) * Math.pow(n / Math.E, n);
  };

  const renderDistributionCurve = () => {
    if (!simulation) return null;

    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 40, bottom: 40, left: 40 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const xMin = -4;
    const xMax = 4;
    const numPoints = 200;
    
    const df = simulation.degreesOfFreedom;
    const isNormal = simulation.distributionType === 'normal';

    // Generate curve points
    const points: Array<{ x: number; y: number }> = [];
    let maxY = 0;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * (i / numPoints);
      const y = isNormal ? normalPDF(x) : tPDF(x, df || 10);
      points.push({ x, y });
      if (y > maxY) maxY = y;
    }

    const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const yScale = (y: number) => padding.top + plotHeight - (y / maxY) * plotHeight;

    // Create path for the distribution curve
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`
    ).join(' ');

    // Create shaded regions for critical areas
    const createShadedPath = (x1: number, x2: number, color: string) => {
      const shadedPoints = points.filter(p => p.x >= x1 && p.x <= x2);
      if (shadedPoints.length === 0) return null;
      
      const path = [
        `M ${xScale(x1)} ${yScale(0)}`,
        ...shadedPoints.map(p => `L ${xScale(p.x)} ${yScale(p.y)}`),
        `L ${xScale(x2)} ${yScale(0)}`,
        'Z'
      ].join(' ');
      
      return <path d={path} fill={color} opacity="0.3" />;
    };

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
          {isNormal ? 'Standard Normal' : `T-Distribution (df=${df})`} Distribution
        </h3>
        <svg width={width} height={height} className="border border-gray-300 rounded bg-white">
          {/* Critical regions */}
          {testType === 'two-tailed' && simulation.criticalValueLeft !== null && (
            createShadedPath(xMin, simulation.criticalValueLeft, '#ef4444')
          )}
          {testType === 'two-tailed' && simulation.criticalValueRight !== null && (
            createShadedPath(simulation.criticalValueRight, xMax, '#ef4444')
          )}
          {testType === 'left-tailed' && simulation.criticalValueLeft !== null && (
            createShadedPath(xMin, simulation.criticalValueLeft, '#ef4444')
          )}
          {testType === 'right-tailed' && simulation.criticalValueRight !== null && (
            createShadedPath(simulation.criticalValueRight, xMax, '#ef4444')
          )}
          
          {/* Distribution curve */}
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={width - padding.right}
            y2={yScale(0)}
            stroke="black"
            strokeWidth="1"
          />
          
          {/* Y-axis */}
          <line
            x1={xScale(0)}
            y1={padding.top}
            x2={xScale(0)}
            y2={height - padding.bottom}
            stroke="black"
            strokeWidth="1"
          />
          
          {/* X-axis labels */}
          {[-3, -2, -1, 0, 1, 2, 3].map(val => (
            <g key={val}>
              <line
                x1={xScale(val)}
                y1={yScale(0)}
                x2={xScale(val)}
                y2={yScale(0) + 5}
                stroke="black"
              />
              <text
                x={xScale(val)}
                y={yScale(0) + 20}
                textAnchor="middle"
                fontSize="12"
              >
                {val}
              </text>
            </g>
          ))}
          
          {/* Critical value markers */}
          {simulation.criticalValueLeft !== null && (
            <>
              <line
                x1={xScale(simulation.criticalValueLeft)}
                y1={padding.top}
                x2={xScale(simulation.criticalValueLeft)}
                y2={height - padding.bottom}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={xScale(simulation.criticalValueLeft)}
                y={padding.top - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#ef4444"
              >
                {simulation.criticalValueLeft.toFixed(3)}
              </text>
            </>
          )}
          
          {simulation.criticalValueRight !== null && (
            <>
              <line
                x1={xScale(simulation.criticalValueRight)}
                y1={padding.top}
                x2={xScale(simulation.criticalValueRight)}
                y2={height - padding.bottom}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={xScale(simulation.criticalValueRight)}
                y={padding.top - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#ef4444"
              >
                {simulation.criticalValueRight.toFixed(3)}
              </text>
            </>
          )}
          
          {/* Test statistic marker */}
          {simulation.testStatistic !== undefined && 
           simulation.testStatistic >= xMin && 
           simulation.testStatistic <= xMax && (
            <>
              <line
                x1={xScale(simulation.testStatistic)}
                y1={padding.top}
                x2={xScale(simulation.testStatistic)}
                y2={height - padding.bottom}
                stroke="#10b981"
                strokeWidth="3"
              />
              <circle
                cx={xScale(simulation.testStatistic)}
                cy={yScale(isNormal ? normalPDF(simulation.testStatistic) : tPDF(simulation.testStatistic, df || 10))}
                r="5"
                fill="#10b981"
              />
              <text
                x={xScale(simulation.testStatistic)}
                y={height - padding.bottom + 35}
                textAnchor="middle"
                fontSize="12"
                fill="#10b981"
                fontWeight="bold"
              >
                {isNormal ? 'z' : 't'} = {simulation.testStatistic.toFixed(3)}
              </text>
            </>
          )}
          
          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
          >
            {isNormal ? 'z-value' : 't-value'}
          </text>
          
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            transform={`rotate(-90 15 ${height / 2})`}
          >
            Probability Density
          </text>
        </svg>
        
        {/* Legend */}
        <div className="mt-4 flex gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 opacity-30"></div>
            <span>Critical Region (α = {alpha})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span>Test Statistic</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Z-Test & T-Test Simulator</h1>
        <p className="text-gray-600">
          Perform hypothesis testing using Z-test (known population variance) or T-test (unknown population variance)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          {/* Test Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Test Type</label>
            <Tabs
              tabs={[
                { id: 'z-test', label: 'Z-Test' },
                { id: 't-test', label: 'T-Test' },
              ]}
              activeTab={testMode}
              onChange={(id) => setTestMode(id as 'z-test' | 't-test')}
            />
            <p className="text-xs text-gray-500 mt-1">
              {testMode === 'z-test' 
                ? 'Use when population σ is known' 
                : 'Use when population σ is unknown'}
            </p>
          </div>

          {/* Sample Data */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Sample Data (comma-separated)
            </label>
            <textarea
              value={sampleDataInput}
              onChange={(e) => setSampleDataInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded min-h-[80px] font-mono text-sm"
              placeholder="100, 102, 98, 105, 99..."
            />
          </div>

          {/* Hypothesized Mean */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Hypothesized Mean (μ₀)
            </label>
            <Input
              type="number"
              value={mu0}
              onChange={(e) => setMu0(e.target.value)}
              step="0.1"
            />
          </div>

          {/* Population Std Dev (Z-test only) */}
          {testMode === 'z-test' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Population Std Dev (σ)
              </label>
              <Input
                type="number"
                value={sigma}
                onChange={(e) => setSigma(e.target.value)}
                step="0.1"
                min="0.01"
              />
            </div>
          )}

          {/* Significance Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Significance Level (α)
            </label>
            <Tabs
              tabs={[
                { id: '0.01', label: '0.01' },
                { id: '0.05', label: '0.05' },
                { id: '0.10', label: '0.10' },
              ]}
              activeTab={alpha.toString()}
              onChange={(id) => setAlpha(parseFloat(id))}
            />
          </div>

          {/* Test Type (One/Two-tailed) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Hypothesis Test
            </label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as TestType)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="two-tailed">Two-Tailed (μ ≠ μ₀)</option>
              <option value="left-tailed">Left-Tailed (μ &lt; μ₀)</option>
              <option value="right-tailed">Right-Tailed (μ &gt; μ₀)</option>
            </select>
          </div>

          <Button onClick={runSimulation} className="w-full">
            Run {testMode === 'z-test' ? 'Z-Test' : 'T-Test'}
          </Button>
        </Card>

        {/* Visualization and Steps Panel */}
        <div className="lg:col-span-2 space-y-6">
          {simulation && (
            <>
              {/* Control Panel */}
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePlayPause}
                      variant="outline"
                      size="sm"
                    >
                      {isPlaying ? (
                        <>
                          <PauseIcon className="w-4 h-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-4 h-4 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="sm">
                      <RefreshIcon className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleStepForward}
                      variant="outline"
                      size="sm"
                      disabled={currentStep >= simulation.steps.length - 1}
                    >
                      <StepForwardIcon className="w-4 h-4 mr-1" />
                      Step
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {simulation.steps.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / simulation.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </Card>

              {/* Results Summary */}
              <Card>
                <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Test Statistic</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {testMode === 'z-test' ? 'z' : 't'} = {simulation.testStatistic?.toFixed(4)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">P-Value</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {simulation.pValue?.toFixed(6)}
                    </div>
                  </div>
                  <div className="col-span-2 p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Decision</div>
                    <div className={`text-xl font-bold ${simulation.reject ? 'text-red-600' : 'text-green-600'}`}>
                      {simulation.decision}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Distribution Visualization */}
              <Card>
                {renderDistributionCurve()}
              </Card>

              {/* Step-by-Step Explanation */}
              <Card>
                <h2 className="text-xl font-semibold mb-4">Step-by-Step Process</h2>
                <div className="space-y-4">
                  {simulation.steps.slice(0, currentStep + 1).map((step, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        index === currentStep
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === currentStep
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {step.description}
                          </h3>
                          <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded">
                            {step.details}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!simulation && (
            <Card>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No simulation running</p>
                <p className="text-sm">Configure parameters and click "Run {testMode === 'z-test' ? 'Z-Test' : 'T-Test'}" to start</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}