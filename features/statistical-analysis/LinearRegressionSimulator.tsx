import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getLinearRegressionSimulation, 
  generateSampleData,
  predict,
  type DataPoint 
} from '../../services/linearRegressionService';
import type { AlgorithmSimulation, AlgorithmStep } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PlayIcon, PauseIcon, StepForwardIcon, RefreshIcon } from '../../components/Icons';
import { useInterval } from '../../hooks/useInterval';

const LinearRegressionSimulator: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [simulation, setSimulation] = useState<AlgorithmSimulation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Input states
  const [inputX, setInputX] = useState<string>('');
  const [inputY, setInputY] = useState<string>('');
  const [predictionX, setPredictionX] = useState<string>('');
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  
  // UI state
  const [showResiduals, setShowResiduals] = useState<boolean>(true);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);

  // Generate initial sample data
  useEffect(() => {
    const initialData = generateSampleData('positive', 15);
    setDataPoints(initialData);
  }, []);

  // Run simulation when data changes
  const runSimulation = useCallback(() => {
    if (dataPoints.length >= 2) {
      const simData = getLinearRegressionSimulation(dataPoints);
      setSimulation(simData);
      setCurrentStep(0);
      setIsPlaying(false);
      setPredictionResult(null);
      setShowPrediction(false);
    }
  }, [dataPoints]);

  useEffect(() => {
    if (dataPoints.length >= 2) {
      runSimulation();
    }
  }, [dataPoints, runSimulation]);

  // Animation control
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

  // Add data point
  const handleAddPoint = () => {
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);
    
    if (!isNaN(x) && !isNaN(y)) {
      setDataPoints([...dataPoints, { x, y }]);
      setInputX('');
      setInputY('');
    }
  };

  // Remove last point
  const handleRemoveLastPoint = () => {
    if (dataPoints.length > 0) {
      setDataPoints(dataPoints.slice(0, -1));
    }
  };

  // Clear all points
  const handleClearPoints = () => {
    setDataPoints([]);
    setSimulation(null);
  };

  // Generate sample data
  const handleGenerateSample = (type: 'positive' | 'negative' | 'scattered' | 'perfect') => {
    const newData = generateSampleData(type, 20);
    setDataPoints(newData);
  };

  // Make prediction
  const handlePredict = () => {
    const x = parseFloat(predictionX);
    if (!isNaN(x) && simulation?.result) {
      const { slope, intercept } = simulation.result;
      const predicted = predict(x, slope, intercept);
      setPredictionResult(predicted);
      setShowPrediction(true);
    }
  };

  const stepData: AlgorithmStep | null = simulation ? simulation.steps[currentStep] : null;

  // Calculate plot bounds
  const { minX, maxX, minY, maxY, rangeX, rangeY } = useMemo(() => {
    if (dataPoints.length === 0) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100, rangeX: 100, rangeY: 100 };
    }
    
    const xs = dataPoints.map(p => p.x);
    const ys = dataPoints.map(p => p.y);
    
    // Add prediction point to bounds if active
    if (showPrediction && predictionResult !== null && predictionX) {
      xs.push(parseFloat(predictionX));
      ys.push(predictionResult);
    }
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const rangeX = maxX - minX || 10;
    const rangeY = maxY - minY || 10;
    
    const padding = 0.1;
    
    return {
      minX: minX - rangeX * padding,
      maxX: maxX + rangeX * padding,
      minY: minY - rangeY * padding,
      maxY: maxY + rangeY * padding,
      rangeX: rangeX * (1 + 2 * padding),
      rangeY: rangeY * (1 + 2 * padding)
    };
  }, [dataPoints, showPrediction, predictionResult, predictionX]);

  // SVG dimensions
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Scale functions
  const scaleX = (x: number) => margin.left + ((x - minX) / rangeX) * plotWidth;
  const scaleY = (y: number) => margin.top + plotHeight - ((y - minY) / rangeY) * plotHeight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Regression Visualization">
          <div className="p-4">
            {stepData && dataPoints.length >= 2 ? (
              <div className="bg-background-elevated rounded-lg p-4">
                <svg
                  width={width}
                  height={height}
                  className="w-full bg-gray-900 rounded"
                  viewBox={`0 0 ${width} ${height}`}
                >
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map(t => {
                    const x = minX + t * rangeX;
                    const y = minY + t * rangeY;
                    return (
                      <g key={t}>
                        <line
                          x1={scaleX(x)}
                          y1={margin.top}
                          x2={scaleX(x)}
                          y2={height - margin.bottom}
                          stroke="#374151"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                        <line
                          x1={margin.left}
                          y1={scaleY(y)}
                          x2={width - margin.right}
                          y2={scaleY(y)}
                          stroke="#374151"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </g>
                    );
                  })}

                  {/* Axes */}
                  <line
                    x1={margin.left}
                    y1={height - margin.bottom}
                    x2={width - margin.right}
                    y2={height - margin.bottom}
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  <line
                    x1={margin.left}
                    y1={margin.top}
                    x2={margin.left}
                    y2={height - margin.bottom}
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />

                  {/* Axis labels */}
                  <text
                    x={width / 2}
                    y={height - 5}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    x
                  </text>
                  <text
                    x={15}
                    y={height / 2}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="12"
                    fontWeight="bold"
                    transform={`rotate(-90 15 ${height / 2})`}
                  >
                    y
                  </text>

                  {/* Tick labels */}
                  {[0, 0.5, 1].map(t => {
                    const x = minX + t * rangeX;
                    const y = minY + t * rangeY;
                    return (
                      <g key={`tick-${t}`}>
                        <text
                          x={scaleX(x)}
                          y={height - margin.bottom + 15}
                          textAnchor="middle"
                          fill="#9ca3af"
                          fontSize="10"
                        >
                          {x.toFixed(1)}
                        </text>
                        <text
                          x={margin.left - 10}
                          y={scaleY(y) + 4}
                          textAnchor="end"
                          fill="#9ca3af"
                          fontSize="10"
                        >
                          {y.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Mean lines */}
                  {stepData.state.meanX !== undefined && stepData.state.meanY !== undefined && (
                    <>
                      <line
                        x1={scaleX(stepData.state.meanX)}
                        y1={margin.top}
                        x2={scaleX(stepData.state.meanX)}
                        y2={height - margin.bottom}
                        stroke="#fbbf24"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                      <line
                        x1={margin.left}
                        y1={scaleY(stepData.state.meanY)}
                        x2={width - margin.right}
                        y2={scaleY(stepData.state.meanY)}
                        stroke="#fbbf24"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                      {/* Mean point */}
                      <circle
                        cx={scaleX(stepData.state.meanX)}
                        cy={scaleY(stepData.state.meanY)}
                        r="4"
                        fill="#fbbf24"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                    </>
                  )}

                  {/* Regression line */}
                  {stepData.state.slope !== undefined && stepData.state.intercept !== undefined && (
                    <line
                      x1={scaleX(minX)}
                      y1={scaleY(stepData.state.intercept + stepData.state.slope * minX)}
                      x2={scaleX(maxX)}
                      y2={scaleY(stepData.state.intercept + stepData.state.slope * maxX)}
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  )}

                  {/* Residuals */}
                  {showResiduals && stepData.state.residuals && (
                    <>
                      {stepData.state.residuals.map((r: any, idx: number) => {
                        const predictedY = stepData.state.intercept + stepData.state.slope * r.x;
                        return (
                          <line
                            key={`residual-${idx}`}
                            x1={scaleX(r.x)}
                            y1={scaleY(r.y)}
                            x2={scaleX(r.x)}
                            y2={scaleY(predictedY)}
                            stroke="#ef4444"
                            strokeWidth="1"
                            opacity="0.5"
                            strokeDasharray="2,2"
                          />
                        );
                      })}
                    </>
                  )}

                  {/* Data points */}
                  {dataPoints.map((point, idx) => (
                    <circle
                      key={idx}
                      cx={scaleX(point.x)}
                      cy={scaleY(point.y)}
                      r="4"
                      fill="#10b981"
                      stroke="#fff"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  ))}

                  {/* Prediction point */}
                  {showPrediction && predictionResult !== null && predictionX && (
                    <>
                      <circle
                        cx={scaleX(parseFloat(predictionX))}
                        cy={scaleY(predictionResult)}
                        r="6"
                        fill="#ec4899"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <line
                        x1={scaleX(parseFloat(predictionX))}
                        y1={height - margin.bottom}
                        x2={scaleX(parseFloat(predictionX))}
                        y2={scaleY(predictionResult)}
                        stroke="#ec4899"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        opacity="0.5"
                      />
                    </>
                  )}
                </svg>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-text-secondary">Data Points</span>
                  </div>
                  {stepData.state.slope !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-blue-500"></div>
                      <span className="text-text-secondary">Regression Line</span>
                    </div>
                  )}
                  {stepData.state.meanX !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-amber-400" style={{ borderTop: '1px dashed' }}></div>
                      <span className="text-text-secondary">Mean (x̄, ȳ)</span>
                    </div>
                  )}
                  {showResiduals && stepData.state.residuals && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-red-500" style={{ borderTop: '1px dashed' }}></div>
                      <span className="text-text-secondary">Residuals</span>
                    </div>
                  )}
                  {showPrediction && predictionResult !== null && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-text-secondary">Prediction</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-background-elevated rounded-lg p-8 text-center text-text-tertiary">
                <p>Add at least 2 data points to start the regression analysis</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <p className="text-sm text-center font-mono text-text-secondary">
              {stepData?.description || 'Waiting for data...'}
            </p>
          </div>
        </Card>

        <Card title="Step Details">
          <div className="p-4">
            {stepData?.metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(stepData.metrics).map(([key, value]) => (
                  <div key={key} className="bg-background-elevated p-3 rounded">
                    <div className="text-xs text-text-tertiary mb-1">{key}</div>
                    <div className="font-mono text-sm text-text-primary">
                      {typeof value === 'object' 
                        ? JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '')
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-tertiary">No metrics available</p>
            )}
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
        <Card title="Controls">
          <div className="space-y-4">
            {/* Playback controls */}
            {simulation && (
              <>
                <div className="flex items-center justify-around pt-2">
                  <Button
                    onClick={() => handleStep(-1)}
                    disabled={currentStep === 0}
                    variant="secondary"
                    size="small"
                  >
                    <StepForwardIcon className="w-4 h-4 transform rotate-180" />
                  </Button>
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={currentStep === simulation.steps.length - 1}
                    variant="primary"
                    size="small"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStep(1)}
                    disabled={currentStep === simulation.steps.length - 1}
                    variant="secondary"
                    size="small"
                  >
                    <StepForwardIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center text-sm text-text-secondary">
                  Step {currentStep + 1} of {simulation.steps.length}
                </div>
              </>
            )}

            {/* Options */}
            <div className="pt-4 border-t border-border space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showResiduals}
                  onChange={(e) => setShowResiduals(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">Show Residuals</span>
              </label>
            </div>

            {/* Sample data generators */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-text-secondary mb-2">Generate Sample Data:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleGenerateSample('positive')} size="small">
                  Positive
                </Button>
                <Button onClick={() => handleGenerateSample('negative')} size="small">
                  Negative
                </Button>
                <Button onClick={() => handleGenerateSample('scattered')} size="small">
                  Scattered
                </Button>
                <Button onClick={() => handleGenerateSample('perfect')} size="small">
                  Perfect
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Add Data Points">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={inputX}
                onChange={(e) => setInputX(e.target.value)}
                placeholder="x value"
                step="any"
              />
              <Input
                type="number"
                value={inputY}
                onChange={(e) => setInputY(e.target.value)}
                placeholder="y value"
                step="any"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddPoint} className="flex-1">
                Add Point
              </Button>
              <Button onClick={handleRemoveLastPoint} variant="secondary" className="flex-1">
                Remove Last
              </Button>
            </div>
            <Button onClick={handleClearPoints} variant="secondary" className="w-full">
              Clear All
            </Button>
            <div className="text-sm text-text-tertiary text-center">
              {dataPoints.length} point{dataPoints.length !== 1 ? 's' : ''} added
            </div>
          </div>
        </Card>

        <Card title="Make Predictions">
          <div className="space-y-4">
            {simulation?.result ? (
              <>
                <div className="bg-background-elevated p-3 rounded text-sm font-mono">
                  <div className="text-text-tertiary mb-1">Regression Equation:</div>
                  <div className="text-text-primary">
                    y = {simulation.result.intercept.toFixed(4)} + {simulation.result.slope.toFixed(4)}x
                  </div>
                </div>
                <Input
                  type="number"
                  value={predictionX}
                  onChange={(e) => setPredictionX(e.target.value)}
                  placeholder="Enter x value"
                  step="any"
                />
                <Button onClick={handlePredict} className="w-full">
                  Predict y
                </Button>
                {predictionResult !== null && (
                  <div className="bg-pink-500/10 border border-pink-500/30 p-3 rounded">
                    <div className="text-xs text-text-tertiary mb-1">Predicted value:</div>
                    <div className="font-mono text-lg text-pink-400">
                      y = {predictionResult.toFixed(4)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-text-tertiary text-sm">
                Run simulation first to enable predictions
              </p>
            )}
          </div>
        </Card>

        <Card title="Results Summary">
          <div className="space-y-3">
            {simulation?.result ? (
              <>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">Slope (β₁)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.slope.toFixed(4)}
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">Intercept (β₀)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.intercept.toFixed(4)}
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">R² (Coefficient of Determination)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.rSquared.toFixed(4)} ({(simulation.result.rSquared * 100).toFixed(2)}%)
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">Correlation (r)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.correlation.toFixed(4)}
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">SSE (Sum of Squared Errors)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.sse.toFixed(4)}
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">MSE (Mean Squared Error)</div>
                  <div className="font-mono text-sm text-text-primary">
                    {simulation.result.mse.toFixed(4)}
                  </div>
                </div>
                <div className="bg-background-elevated p-3 rounded">
                  <div className="text-xs text-text-tertiary mb-1">RMSE</div>
                  <div className="font-mono text-sm text-text-primary">
                    {Math.sqrt(simulation.result.mse).toFixed(4)}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-text-tertiary text-sm">
                No results yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LinearRegressionSimulator;