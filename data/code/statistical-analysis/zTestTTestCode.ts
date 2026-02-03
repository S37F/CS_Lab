
export const zTestTTestCode = {
    'Python': `# Python's scientific libraries like SciPy make these tests easy.
from scipy import stats
import numpy as np

# --- One-Sample T-Test ---
# Used to determine if the mean of a sample is statistically
# different from a known or hypothesized population mean.

sample_data = [2.5, 3.1, 2.8, 3.5, 3.0, 2.9, 3.2]
hypothesized_mean = 3.0

# Perform the t-test
t_statistic, p_value = stats.ttest_1samp(sample_data, hypothesized_mean)

print(f"One-Sample T-Test:")
print(f"T-statistic: {t_statistic:.4f}")
print(f"P-value: {p_value:.4f}")

alpha = 0.05
if p_value < alpha:
    print("Result is statistically significant (reject null hypothesis).")
else:
    print("Result is not statistically significant (fail to reject null hypothesis).")

# --- One-Sample Z-Test ---
# Used when the population standard deviation is known.
# (This is rare in practice, so T-tests are more common).
# statsmodels library is often used for this.
from statsmodels.stats.weightstats import ztest

# Assume population standard deviation is known to be 0.5
population_std_dev = 0.5

z_statistic, p_value_z = ztest(x1=sample_data, value=hypothesized_mean, ddof=0)
# Note: ztest calculates based on sample std dev if population std dev isn't passed directly,
# but the principle is what's important here.

print(f"\\nOne-Sample Z-Test (conceptual):")
print(f"Z-statistic: {z_statistic:.4f}")
print(f"P-value: {p_value_z:.4f}")
`,
    'Java': `// Statistical tests in Java are often performed using libraries
// like Apache Commons Math.

import org.apache.commons.math3.stat.inference.TTest;

public class HypothesisTests {
    public static void main(String[] args) {
        // --- One-Sample T-Test ---
        double[] sampleData = {2.5, 3.1, 2.8, 3.5, 3.0, 2.9, 3.2};
        double hypothesizedMean = 3.0;
        
        TTest tTest = new TTest();
        double pValue = tTest.tTest(hypothesizedMean, sampleData);

        System.out.println("One-Sample T-Test:");
        System.out.printf("P-value: %.4f%n", pValue);

        double alpha = 0.05;
        if (pValue < alpha) {
            System.out.println("Result is statistically significant.");
        } else {
            System.out.println("Result is not statistically significant.");
        }
        
        // Z-Test would require a similar library or manual calculation.
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <numeric>
#include <cmath>

// Manually implementing statistical tests in C++.
// For production, use a library like Boost.Math.

// Calculates the mean of a sample
double mean(const std::vector<double>& data) {
    return std::accumulate(data.begin(), data.end(), 0.0) / data.size();
}

// Calculates the sample standard deviation
double std_dev(const std::vector<double>& data) {
    double m = mean(data);
    double sum_sq_diff = 0.0;
    for (double val : data) {
        sum_sq_diff += (val - m) * (val - m);
    }
    return std::sqrt(sum_sq_diff / (data.size() - 1));
}

// One-Sample T-Test
double one_sample_t_test(const std::vector<double>& sample, double pop_mean) {
    double sample_mean = mean(sample);
    double sample_std = std_dev(sample);
    int n = sample.size();
    
    // Calculate the t-statistic
    double t_stat = (sample_mean - pop_mean) / (sample_std / std::sqrt(n));
    
    // Calculating p-value from t-statistic requires a t-distribution table
    // or a special function (e.g., from Boost), which is complex.
    
    return t_stat;
}

int main() {
    std::vector<double> sample_data = {2.5, 3.1, 2.8, 3.5, 3.0, 2.9, 3.2};
    double hypothesized_mean = 3.0;
    
    double t_statistic = one_sample_t_test(sample_data, hypothesized_mean);
    
    std::cout << "One-Sample T-Test:" << std::endl;
    std::cout << "T-statistic: " << t_statistic << std::endl;
    std::cout << "(P-value calculation requires a stats library)" << std::endl;
    
    return 0;
}
`
};
