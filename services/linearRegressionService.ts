import type { AlgorithmSimulation, AlgorithmStep } from '../types';

export interface DataPoint {
  x: number;
  y: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  correlation: number;
  sse: number;
  mse: number;
  predictions: { x: number; y: number }[];
  residuals: { x: number; y: number; residual: number }[];
}

interface RegressionState {
  dataPoints: DataPoint[];
  meanX?: number;
  meanY?: number;
  slope?: number;
  intercept?: number;
  rSquared?: number;
  correlation?: number;
  sse?: number;
  mse?: number;
  predictions?: { x: number; y: number }[];
  residuals?: { x: number; y: number; residual: number }[];
  currentCalculation?: string;
  sumXY?: number;
  sumX?: number;
  sumY?: number;
  sumXSquared?: number;
  sumYSquared?: number;
  deviationsX?: number[];
  deviationsY?: number[];
  productDeviations?: number[];
  squaredDeviationsX?: number[];
  ssTot?: number;
  ssRes?: number;
}

// Helper function to round to specified decimal places
function round(value: number, decimals: number = 4): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Calculate mean of an array
function mean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Calculate sum of products
function sumOfProducts(arr1: number[], arr2: number[]): number {
  return arr1.reduce((sum, val, idx) => sum + val * arr2[idx], 0);
}

// Calculate sum of squares
function sumOfSquares(values: number[]): number {
  return values.reduce((sum, val) => sum + val * val, 0);
}

export function getLinearRegressionSimulation(dataPoints: DataPoint[]): AlgorithmSimulation {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];

  if (dataPoints.length < 2) {
    return {
      success: false,
      result: null,
      steps: [],
      metadata: {
        execution_time_ms: performance.now() - startTime,
        memory_usage_mb: 0,
        complexity: {
          time: 'O(n)',
          space: 'O(n)'
        }
      }
    };
  }

  const n = dataPoints.length;
  const xValues = dataPoints.map(p => p.x);
  const yValues = dataPoints.map(p => p.y);

  // Step 1: Show initial data
  steps.push({
    id: steps.length,
    description: `Dataset with ${n} points loaded`,
    state: {
      dataPoints: [...dataPoints],
      currentCalculation: 'initialization'
    },
    metrics: {
      n,
      points: dataPoints.map((p, i) => `(${round(p.x, 2)}, ${round(p.y, 2)})`)
    },
    educational_notes: [
      'Simple Linear Regression finds the best-fit line: y = β₀ + β₁x',
      'β₁ (slope) represents the change in y for each unit change in x',
      'β₀ (intercept) is the y-value when x = 0',
      'The line minimizes the sum of squared residuals (least squares method)'
    ]
  });

  // Step 2: Calculate means
  const meanX = mean(xValues);
  const meanY = mean(yValues);

  steps.push({
    id: steps.length,
    description: `Calculate mean of x and y values`,
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      currentCalculation: 'means',
      sumX: xValues.reduce((a, b) => a + b, 0),
      sumY: yValues.reduce((a, b) => a + b, 0)
    },
    metrics: {
      'x̄ (mean of x)': round(meanX, 4),
      'ȳ (mean of y)': round(meanY, 4),
      'Σx': round(xValues.reduce((a, b) => a + b, 0), 4),
      'Σy': round(yValues.reduce((a, b) => a + b, 0), 4),
      'Formula': 'x̄ = Σx / n, ȳ = Σy / n'
    },
    educational_notes: [
      `Mean of x (x̄) = ${round(meanX, 4)}`,
      `Mean of y (ȳ) = ${round(meanY, 4)}`,
      'These means represent the center point of the data',
      'The regression line will always pass through (x̄, ȳ)'
    ]
  });

  // Step 3: Calculate deviations from mean
  const deviationsX = xValues.map(x => x - meanX);
  const deviationsY = yValues.map(y => y - meanY);

  steps.push({
    id: steps.length,
    description: 'Calculate deviations from the mean for each point',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      deviationsX,
      deviationsY,
      currentCalculation: 'deviations'
    },
    metrics: {
      'Deviations X': deviationsX.map(d => round(d, 3)),
      'Deviations Y': deviationsY.map(d => round(d, 3)),
      'Formula': '(xᵢ - x̄), (yᵢ - ȳ)'
    },
    educational_notes: [
      'Deviations show how far each point is from the mean',
      'Positive deviation: point is above/right of mean',
      'Negative deviation: point is below/left of mean',
      'Deviations are used to calculate covariance and variance'
    ]
  });

  // Step 4: Calculate products and squared deviations
  const productDeviations = deviationsX.map((dx, i) => dx * deviationsY[i]);
  const squaredDeviationsX = deviationsX.map(dx => dx * dx);

  const sumProductDeviations = productDeviations.reduce((a, b) => a + b, 0);
  const sumSquaredDeviationsX = squaredDeviationsX.reduce((a, b) => a + b, 0);

  steps.push({
    id: steps.length,
    description: 'Calculate products of deviations and squared deviations',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      deviationsX,
      deviationsY,
      productDeviations,
      squaredDeviationsX,
      currentCalculation: 'products'
    },
    metrics: {
      'Σ[(xᵢ - x̄)(yᵢ - ȳ)]': round(sumProductDeviations, 4),
      'Σ[(xᵢ - x̄)²]': round(sumSquaredDeviationsX, 4),
      'Products': productDeviations.map(p => round(p, 3)),
      'Squared X Deviations': squaredDeviationsX.map(s => round(s, 3))
    },
    educational_notes: [
      'Product of deviations measures how x and y vary together',
      'Squared deviations of x measure the spread of x values',
      'These sums are the numerator and denominator for the slope calculation'
    ]
  });

  // Step 5: Calculate slope (β1)
  const slope = sumProductDeviations / sumSquaredDeviationsX;

  steps.push({
    id: steps.length,
    description: 'Calculate the slope (β₁) using least squares formula',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      currentCalculation: 'slope'
    },
    metrics: {
      'β₁ (slope)': round(slope, 4),
      'Numerator': round(sumProductDeviations, 4),
      'Denominator': round(sumSquaredDeviationsX, 4),
      'Formula': 'β₁ = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / Σ[(xᵢ - x̄)²]'
    },
    educational_notes: [
      `Slope β₁ = ${round(slope, 4)}`,
      'The slope represents the rate of change of y with respect to x',
      slope > 0 ? 'Positive slope: y increases as x increases' : 'Negative slope: y decreases as x increases',
      `For every 1-unit increase in x, y changes by ${round(slope, 4)} units`
    ]
  });

  // Step 6: Calculate intercept (β0)
  const intercept = meanY - slope * meanX;

  steps.push({
    id: steps.length,
    description: 'Calculate the y-intercept (β₀)',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      intercept,
      currentCalculation: 'intercept'
    },
    metrics: {
      'β₀ (intercept)': round(intercept, 4),
      'ȳ': round(meanY, 4),
      'β₁ × x̄': round(slope * meanX, 4),
      'Formula': 'β₀ = ȳ - β₁ × x̄'
    },
    educational_notes: [
      `Intercept β₀ = ${round(intercept, 4)}`,
      'The intercept is the predicted y-value when x = 0',
      'The regression line equation is: y = ' + round(intercept, 4) + ' + ' + round(slope, 4) + 'x',
      'The line passes through the point (x̄, ȳ) = (' + round(meanX, 2) + ', ' + round(meanY, 2) + ')'
    ]
  });

  // Step 7: Calculate predictions and residuals
  const predictions = dataPoints.map(p => ({
    x: p.x,
    y: intercept + slope * p.x
  }));

  const residuals = dataPoints.map((p, i) => ({
    x: p.x,
    y: p.y,
    residual: p.y - predictions[i].y
  }));

  steps.push({
    id: steps.length,
    description: 'Calculate predicted values and residuals',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      intercept,
      predictions,
      residuals,
      currentCalculation: 'residuals'
    },
    metrics: {
      'Predictions': predictions.map(p => round(p.y, 3)),
      'Residuals': residuals.map(r => round(r.residual, 3)),
      'Formula': 'ŷᵢ = β₀ + β₁xᵢ, residual = yᵢ - ŷᵢ'
    },
    educational_notes: [
      'Predicted value ŷ is calculated using the regression equation',
      'Residual = actual y - predicted y (vertical distance from point to line)',
      'Positive residual: actual point is above the line',
      'Negative residual: actual point is below the line'
    ]
  });

  // Step 8: Calculate Sum of Squared Errors (SSE)
  const sse = residuals.reduce((sum, r) => sum + r.residual * r.residual, 0);
  const mse = sse / n;

  steps.push({
    id: steps.length,
    description: 'Calculate Sum of Squared Errors (SSE) and Mean Squared Error (MSE)',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      intercept,
      predictions,
      residuals,
      sse,
      mse,
      currentCalculation: 'sse'
    },
    metrics: {
      'SSE': round(sse, 4),
      'MSE': round(mse, 4),
      'RMSE': round(Math.sqrt(mse), 4),
      'Formula': 'SSE = Σ(yᵢ - ŷᵢ)², MSE = SSE / n'
    },
    educational_notes: [
      `Sum of Squared Errors (SSE) = ${round(sse, 4)}`,
      `Mean Squared Error (MSE) = ${round(mse, 4)}`,
      `Root Mean Squared Error (RMSE) = ${round(Math.sqrt(mse), 4)}`,
      'Lower SSE indicates a better fit to the data',
      'RMSE is in the same units as y and represents typical prediction error'
    ]
  });

  // Step 9: Calculate R² (Coefficient of Determination)
  const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const ssRes = sse;
  const rSquared = 1 - (ssRes / ssTot);

  steps.push({
    id: steps.length,
    description: 'Calculate R² (Coefficient of Determination)',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      intercept,
      predictions,
      residuals,
      sse,
      mse,
      rSquared,
      ssTot,
      ssRes,
      currentCalculation: 'r-squared'
    },
    metrics: {
      'R²': round(rSquared, 4),
      'SS_tot': round(ssTot, 4),
      'SS_res': round(ssRes, 4),
      'Formula': 'R² = 1 - (SS_res / SS_tot)',
      'Percentage': `${round(rSquared * 100, 2)}%`
    },
    educational_notes: [
      `R² = ${round(rSquared, 4)} or ${round(rSquared * 100, 2)}%`,
      'R² measures the proportion of variance in y explained by x',
      `The model explains ${round(rSquared * 100, 2)}% of the variability in y`,
      'R² ranges from 0 to 1; values closer to 1 indicate better fit',
      rSquared > 0.8 ? 'Strong relationship between x and y' : 
        rSquared > 0.5 ? 'Moderate relationship between x and y' : 
        'Weak relationship between x and y'
    ]
  });

  // Step 10: Calculate correlation coefficient
  const sumXY = sumOfProducts(xValues, yValues);
  const sumXSquared = sumOfSquares(xValues);
  const sumYSquared = sumOfSquares(yValues);
  const sumXSum = xValues.reduce((a, b) => a + b, 0);
  const sumYSum = yValues.reduce((a, b) => a + b, 0);

  const correlation = (n * sumXY - sumXSum * sumYSum) / 
    Math.sqrt((n * sumXSquared - sumXSum * sumXSum) * (n * sumYSquared - sumYSum * sumYSum));

  steps.push({
    id: steps.length,
    description: 'Calculate Pearson Correlation Coefficient (r)',
    state: {
      dataPoints: [...dataPoints],
      meanX,
      meanY,
      slope,
      intercept,
      predictions,
      residuals,
      sse,
      mse,
      rSquared,
      correlation,
      currentCalculation: 'correlation'
    },
    metrics: {
      'r (correlation)': round(correlation, 4),
      'r²': round(correlation * correlation, 4),
      'Direction': correlation > 0 ? 'Positive' : 'Negative',
      'Strength': Math.abs(correlation) > 0.8 ? 'Strong' : 
                  Math.abs(correlation) > 0.5 ? 'Moderate' : 'Weak'
    },
    educational_notes: [
      `Correlation coefficient r = ${round(correlation, 4)}`,
      'r measures the strength and direction of linear relationship',
      'r ranges from -1 (perfect negative) to +1 (perfect positive)',
      correlation > 0 ? 'Positive correlation: variables move together' : 
        'Negative correlation: variables move in opposite directions',
      `Strength: ${Math.abs(correlation) > 0.8 ? 'Strong' : 
                   Math.abs(correlation) > 0.5 ? 'Moderate' : 'Weak'} linear relationship`,
      `Note: r² = ${round(correlation * correlation, 4)} matches our R² value`
    ]
  });

  // Final result
  const result: RegressionResult = {
    slope,
    intercept,
    rSquared,
    correlation,
    sse,
    mse,
    predictions,
    residuals
  };

  const endTime = performance.now();

  return {
    success: true,
    result,
    steps,
    metadata: {
      execution_time_ms: endTime - startTime,
      memory_usage_mb: 0.1,
      complexity: {
        time: 'O(n)',
        space: 'O(n)'
      }
    }
  };
}

// Function to make predictions using the regression model
export function predict(x: number, slope: number, intercept: number): number {
  return intercept + slope * x;
}

// Generate sample datasets
export function generateSampleData(type: 'positive' | 'negative' | 'scattered' | 'perfect', numPoints: number = 20): DataPoint[] {
  const points: DataPoint[] = [];
  
  switch (type) {
    case 'positive':
      // Positive correlation with some noise
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 100;
        const y = 20 + 0.8 * x + (Math.random() - 0.5) * 20;
        points.push({ x: round(x, 2), y: round(y, 2) });
      }
      break;
      
    case 'negative':
      // Negative correlation with some noise
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 100;
        const y = 100 - 0.7 * x + (Math.random() - 0.5) * 15;
        points.push({ x: round(x, 2), y: round(y, 2) });
      }
      break;
      
    case 'scattered':
      // Random scattered data
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        points.push({ x: round(x, 2), y: round(y, 2) });
      }
      break;
      
    case 'perfect':
      // Perfect linear relationship
      for (let i = 0; i < numPoints; i++) {
        const x = i * 5;
        const y = 10 + 2 * x;
        points.push({ x: round(x, 2), y: round(y, 2) });
      }
      break;
  }
  
  return points;
}