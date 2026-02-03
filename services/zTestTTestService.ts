import { AlgorithmSimulation } from '../types';

export interface ZTestInput {
  sampleData: number[];
  mu0: number; // hypothesized population mean
  sigma: number; // population standard deviation
  alpha: number; // significance level
  testType: 'two-tailed' | 'left-tailed' | 'right-tailed';
}

export interface TTestInput {
  sampleData: number[];
  mu0: number; // hypothesized population mean
  alpha: number; // significance level
  testType: 'two-tailed' | 'left-tailed' | 'right-tailed';
}

// Standard normal distribution CDF approximation
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

// Inverse of standard normal CDF (approximation)
function normalInverse(p: number): number {
  const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
  const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
  const b4 = 66.8013118877197, b5 = -13.2806815528857;
  const c1 = -7.78489400243029e-3, c2 = -0.322396458041136, c3 = -2.40075827716184;
  const c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;
  const d1 = 7.78469570904146e-3, d2 = 0.32246712907004, d3 = 2.445134137143;
  const d4 = 3.75440866190742;
  const p_low = 0.02425, p_high = 1 - p_low;
  
  let q, r, x;
  
  if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / 
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
         ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  
  return x;
}

// T-distribution CDF approximation
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  
  // Using incomplete beta function approximation
  if (t < 0) {
    return 0.5 * betaIncomplete(x, a, b);
  } else {
    return 1 - 0.5 * betaIncomplete(x, a, b);
  }
}

// Incomplete beta function approximation
function betaIncomplete(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  
  // Using continued fraction approximation
  const EPSILON = 1e-10;
  const MAX_ITER = 100;
  
  let m = 1;
  let d = 1;
  let c = 1;
  let result = 1;
  
  for (let i = 0; i < MAX_ITER; i++) {
    const m2 = 2 * m;
    const aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < EPSILON) d = EPSILON;
    c = 1 + aa / c;
    if (Math.abs(c) < EPSILON) c = EPSILON;
    d = 1 / d;
    result *= d * c;
    
    const aa2 = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1 + aa2 * d;
    if (Math.abs(d) < EPSILON) d = EPSILON;
    c = 1 + aa2 / c;
    if (Math.abs(c) < EPSILON) c = EPSILON;
    d = 1 / d;
    const delta = d * c;
    result *= delta;
    
    if (Math.abs(delta - 1) < EPSILON) break;
    m++;
  }
  
  return (Math.pow(x, a) * Math.pow(1 - x, b) / a) * result / beta(a, b);
}

// Beta function
function beta(a: number, b: number): number {
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
}

// Log gamma function (Lanczos approximation)
function logGamma(x: number): number {
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  
  if (x < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x);
  }
  
  x -= 1;
  let a = c[0];
  for (let i = 1; i < g + 2; i++) {
    a += c[i] / (x + i);
  }
  
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// T-distribution inverse CDF (approximation)
function tInverse(p: number, df: number): number {
  // Use normal approximation for large df
  if (df > 30) {
    return normalInverse(p);
  }
  
  // Hill's algorithm for smaller df
  const a = 1 / (df - 0.5);
  const b = 48 / (a * a);
  let c = ((20700 * a / b - 98) * a - 16) * a + 96.36;
  const d = ((94.5 / (b + c) - 3) / b + 1) * Math.sqrt(a * Math.PI / 2) * df;
  let x = d * p;
  let y = Math.pow(x, 2 / df);
  
  if (y > 0.05 + a) {
    x = normalInverse(p);
    y = x * x;
    if (df < 5) {
      c += 0.3 * (df - 4.5) * (x + 0.6);
    }
    c = (((0.05 * d * x - 5) * x - 7) * x - 2) * x + b + c;
    y = (((((0.4 * y + 6.3) * y + 36) * y + 94.5) / c - y - 3) / b + 1) * x;
    y = a * y * y;
    y = Math.expm1(y);
  } else {
    y = ((1 / (((df + 6) / (df * y) - 0.089 * d - 0.822) * (df + 2) * 3) +
      0.5 / (df + 4)) * y - 1) * (df + 1) / (df + 2) + 1 / y;
  }
  
  return Math.sqrt(df * y);
}

// Calculate sample statistics
function calculateSampleStats(data: number[]) {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  return { n, mean, stdDev };
}

export function getZTestSimulation(input: ZTestInput): AlgorithmSimulation & {
  testStatistic: number;
  pValue: number;
  criticalValueLeft: number | null;
  criticalValueRight: number | null;
  decision: string;
  reject: boolean;
  testType: string;
  distributionType: string;
} {
  const startTime = performance.now();
  const { sampleData, mu0, sigma, alpha, testType } = input;
  const steps: any[] = [];
  
  // Step 1: Calculate sample statistics
  const { n, mean } = calculateSampleStats(sampleData);
  
  steps.push({
    id: steps.length,
    description: 'Calculate Sample Statistics',
    details: `Sample size (n) = ${n}
Sample mean (x̄) = ${mean.toFixed(4)}
Population standard deviation (σ) = ${sigma.toFixed(4)}
Hypothesized mean (μ₀) = ${mu0}`,
    state: { n, sampleMean: mean, populationStdDev: sigma, mu0 },
  });
  
  // Step 2: Calculate standard error
  const standardError = sigma / Math.sqrt(n);
  
  steps.push({
    id: steps.length,
    description: 'Calculate Standard Error',
    details: `SE = σ / √n = ${sigma.toFixed(4)} / √${n} = ${standardError.toFixed(4)}`,
    state: { standardError },
  });
  
  // Step 3: Calculate z-statistic
  const zStat = (mean - mu0) / standardError;
  
  steps.push({
    id: steps.length,
    description: 'Calculate Z-Statistic',
    details: `z = (x̄ - μ₀) / SE
z = (${mean.toFixed(4)} - ${mu0}) / ${standardError.toFixed(4)}
z = ${zStat.toFixed(4)}`,
    state: { zStatistic: zStat },
  });
  
  // Step 4: Determine critical values
  let criticalValueLeft: number | null = null;
  let criticalValueRight: number | null = null;
  
  if (testType === 'two-tailed') {
    criticalValueLeft = normalInverse(alpha / 2);
    criticalValueRight = normalInverse(1 - alpha / 2);
  } else if (testType === 'left-tailed') {
    criticalValueLeft = normalInverse(alpha);
  } else {
    criticalValueRight = normalInverse(1 - alpha);
  }
  
  steps.push({
    id: steps.length,
    description: 'Determine Critical Values',
    details: `Significance level (α) = ${alpha}
Test type: ${testType}
${testType === 'two-tailed' ? 
  `Critical values: z_α/2 = ${criticalValueLeft?.toFixed(4)}, z_1-α/2 = ${criticalValueRight?.toFixed(4)}` :
  testType === 'left-tailed' ?
  `Critical value: z_α = ${criticalValueLeft?.toFixed(4)}` :
  `Critical value: z_1-α = ${criticalValueRight?.toFixed(4)}`}`,
    state: { alpha, criticalValueLeft, criticalValueRight, testType },
  });
  
  // Step 5: Calculate p-value
  let pValue: number;
  if (testType === 'two-tailed') {
    pValue = 2 * (1 - normalCDF(Math.abs(zStat)));
  } else if (testType === 'left-tailed') {
    pValue = normalCDF(zStat);
  } else {
    pValue = 1 - normalCDF(zStat);
  }
  
  steps.push({
    id: steps.length,
    description: 'Calculate P-Value',
    details: `P-value = ${pValue.toFixed(6)}
${testType === 'two-tailed' ? 
  `Two-tailed: p = 2 × P(Z > |z|) = 2 × ${((1 - normalCDF(Math.abs(zStat))) ).toFixed(6)}` :
  testType === 'left-tailed' ?
  `Left-tailed: p = P(Z < z)` :
  `Right-tailed: p = P(Z > z)`}`,
    state: { pValue },
  });
  
  // Step 6: Make decision
  const reject = pValue < alpha;
  const decision = reject ? 'Reject H₀' : 'Fail to reject H₀';
  
  steps.push({
    id: steps.length,
    description: 'Make Decision',
    details: `${decision}
${reject ? 
  `Since p-value (${pValue.toFixed(6)}) < α (${alpha}), we reject the null hypothesis.
There is sufficient evidence to conclude that the population mean differs from ${mu0}.` :
  `Since p-value (${pValue.toFixed(6)}) ≥ α (${alpha}), we fail to reject the null hypothesis.
There is insufficient evidence to conclude that the population mean differs from ${mu0}.`}`,
    state: { decision, reject, pValue, alpha },
  });
  
  const endTime = performance.now();
  
  return {
    steps,
    testStatistic: zStat,
    pValue,
    criticalValueLeft,
    criticalValueRight,
    decision,
    reject,
    testType,
    distributionType: 'z',
    title: 'Z-Test for Population Mean',
    description: `Testing H₀: μ = ${mu0} vs H₁: μ ${testType === 'two-tailed' ? '≠' : testType === 'left-tailed' ? '<' : '>'} ${mu0}`
  };
}

export function getTTestSimulation(input: TTestInput): AlgorithmSimulation & {
  testStatistic: number;
  pValue: number;
  criticalValueLeft: number | null;
  criticalValueRight: number | null;
  decision: string;
  reject: boolean;
  testType: string;
  distributionType: string;
  degreesOfFreedom: number;
} {
  const startTime = performance.now();
  const { sampleData, mu0, alpha, testType } = input;
  const steps: any[] = [];
  
  // Step 1: Calculate sample statistics
  const { n, mean, stdDev } = calculateSampleStats(sampleData);
  const df = n - 1; // degrees of freedom
  
  steps.push({
    id: steps.length,
    description: 'Calculate Sample Statistics',
    details: `Sample size (n) = ${n}
Sample mean (x̄) = ${mean.toFixed(4)}
Sample standard deviation (s) = ${stdDev.toFixed(4)}
Hypothesized mean (μ₀) = ${mu0}
Degrees of freedom (df) = ${df}`,
    state: { n, sampleMean: mean, sampleStdDev: stdDev, mu0, df },
  });
  
  // Step 2: Calculate standard error
  const standardError = stdDev / Math.sqrt(n);
  
  steps.push({
    id: steps.length,
    description: 'Calculate Standard Error',
    details: `SE = s / √n = ${stdDev.toFixed(4)} / √${n} = ${standardError.toFixed(4)}`,
    state: { standardError },
  });
  
  // Step 3: Calculate t-statistic
  const tStat = (mean - mu0) / standardError;
  
  steps.push({
    id: steps.length,
    description: 'Calculate T-Statistic',
    details: `t = (x̄ - μ₀) / SE
t = (${mean.toFixed(4)} - ${mu0}) / ${standardError.toFixed(4)}
t = ${tStat.toFixed(4)}`,
    state: { tStatistic: tStat },
  });
  
  // Step 4: Determine critical values
  let criticalValueLeft: number | null = null;
  let criticalValueRight: number | null = null;
  
  if (testType === 'two-tailed') {
    criticalValueLeft = -tInverse(1 - alpha / 2, df);
    criticalValueRight = tInverse(1 - alpha / 2, df);
  } else if (testType === 'left-tailed') {
    criticalValueLeft = -tInverse(1 - alpha, df);
  } else {
    criticalValueRight = tInverse(1 - alpha, df);
  }
  
  steps.push({
    id: steps.length,
    description: 'Determine Critical Values',
    details: `Significance level (α) = ${alpha}
Test type: ${testType}
Degrees of freedom: ${df}
${testType === 'two-tailed' ? 
  `Critical values: t_α/2 = ${criticalValueLeft?.toFixed(4)}, t_1-α/2 = ${criticalValueRight?.toFixed(4)}` :
  testType === 'left-tailed' ?
  `Critical value: t_α = ${criticalValueLeft?.toFixed(4)}` :
  `Critical value: t_1-α = ${criticalValueRight?.toFixed(4)}`}`,
    state: { alpha, criticalValueLeft, criticalValueRight, testType, df },
  });
  
  // Step 5: Calculate p-value
  let pValue: number;
  if (testType === 'two-tailed') {
    pValue = 2 * (1 - tCDF(Math.abs(tStat), df));
  } else if (testType === 'left-tailed') {
    pValue = tCDF(tStat, df);
  } else {
    pValue = 1 - tCDF(tStat, df);
  }
  
  steps.push({
    id: steps.length,
    description: 'Calculate P-Value',
    details: `P-value = ${pValue.toFixed(6)}
${testType === 'two-tailed' ? 
  `Two-tailed: p = 2 × P(T > |t|) with df = ${df}` :
  testType === 'left-tailed' ?
  `Left-tailed: p = P(T < t) with df = ${df}` :
  `Right-tailed: p = P(T > t) with df = ${df}`}`,
    state: { pValue, df },
  });
  
  // Step 6: Make decision
  const reject = pValue < alpha;
  const decision = reject ? 'Reject H₀' : 'Fail to reject H₀';
  
  steps.push({
    id: steps.length,
    description: 'Make Decision',
    details: `${decision}
${reject ? 
  `Since p-value (${pValue.toFixed(6)}) < α (${alpha}), we reject the null hypothesis.
There is sufficient evidence to conclude that the population mean differs from ${mu0}.` :
  `Since p-value (${pValue.toFixed(6)}) ≥ α (${alpha}), we fail to reject the null hypothesis.
There is insufficient evidence to conclude that the population mean differs from ${mu0}.`}`,
    state: { decision, reject, pValue, alpha },
  });
  
  const endTime = performance.now();
  
  return {
    steps,
    testStatistic: tStat,
    pValue,
    criticalValueLeft,
    criticalValueRight,
    decision,
    reject,
    testType,
    distributionType: 't',
    degreesOfFreedom: df,
    title: 'T-Test for Population Mean',
    description: `Testing H₀: μ = ${mu0} vs H₁: μ ${testType === 'two-tailed' ? '≠' : testType === 'left-tailed' ? '<' : '>'} ${mu0}`
  };
}