export const anovaCode = {
    'Python': `import numpy as np
from scipy import stats

def one_way_anova(*groups):
    """
    Perform One-Way ANOVA (Analysis of Variance)
    
    groups: variable number of arrays/lists representing different groups
    
    Returns: F-statistic, p-value, ANOVA table components
    """
    # Convert to numpy arrays
    groups = [np.array(group) for group in groups]
    
    # Number of groups
    k = len(groups)
    
    # Total number of observations
    n_total = sum(len(group) for group in groups)
    
    # Calculate group means
    group_means = [np.mean(group) for group in groups]
    
    # Calculate overall mean (grand mean)
    grand_mean = np.mean(np.concatenate(groups))
    
    # Calculate Sum of Squares Between Groups (SSB)
    ssb = sum(len(group) * (mean - grand_mean)**2 
              for group, mean in zip(groups, group_means))
    
    # Calculate Sum of Squares Within Groups (SSW)
    ssw = sum(np.sum((group - np.mean(group))**2) for group in groups)
    
    # Total Sum of Squares (SST)
    sst = ssb + ssw
    
    # Degrees of freedom
    df_between = k - 1
    df_within = n_total - k
    df_total = n_total - 1
    
    # Mean Squares
    msb = ssb / df_between  # Mean Square Between
    msw = ssw / df_within   # Mean Square Within
    
    # F-statistic
    f_statistic = msb / msw
    
    # P-value
    p_value = 1 - stats.f.cdf(f_statistic, df_between, df_within)
    
    # Create ANOVA table
    anova_table = {
        'Source': ['Between Groups', 'Within Groups', 'Total'],
        'SS': [ssb, ssw, sst],
        'df': [df_between, df_within, df_total],
        'MS': [msb, msw, None],
        'F': [f_statistic, None, None],
        'P-value': [p_value, None, None]
    }
    
    return f_statistic, p_value, anova_table

def print_anova_table(anova_table):
    """Print ANOVA table in formatted way"""
    print("\nANOVA Table:")
    print("=" * 80)
    print(f"{'Source':<20} {'SS':<15} {'df':<10} {'MS':<15} {'F':<15} {'P-value':<15}")
    print("=" * 80)
    
    for i in range(3):
        source = anova_table['Source'][i]
        ss = f"{anova_table['SS'][i]:.4f}" if anova_table['SS'][i] is not None else ""
        df = f"{anova_table['df'][i]}" if anova_table['df'][i] is not None else ""
        ms = f"{anova_table['MS'][i]:.4f}" if anova_table['MS'][i] is not None else ""
        f_val = f"{anova_table['F'][i]:.4f}" if anova_table['F'][i] is not None else ""
        p_val = f"{anova_table['P-value'][i]:.4f}" if anova_table['P-value'][i] is not None else ""
        
        print(f"{source:<20} {ss:<15} {df:<10} {ms:<15} {f_val:<15} {p_val:<15}")
    
    print("=" * 80)

def tukey_hsd(groups, alpha=0.05):
    """
    Tukey's Honest Significant Difference (HSD) post-hoc test
    For pairwise comparisons after ANOVA
    """
    from scipy.stats import studentized_range
    
    # Calculate parameters
    k = len(groups)
    group_means = [np.mean(group) for group in groups]
    n = [len(group) for group in groups]
    
    # Calculate MSW (Mean Square Within)
    ssw = sum(np.sum((group - np.mean(group))**2) for group in groups)
    df_within = sum(n) - k
    msw = ssw / df_within
    
    # Critical value from studentized range distribution
    q_crit = studentized_range.ppf(1 - alpha, k, df_within)
    
    print(f"\nTukey HSD Post-hoc Test (α = {alpha}):")
    print("=" * 60)
    
    # Pairwise comparisons
    for i in range(k):
        for j in range(i + 1, k):
            mean_diff = abs(group_means[i] - group_means[j])
            
            # Standard error for the comparison
            se = np.sqrt(msw * (1/n[i] + 1/n[j]) / 2)
            
            # HSD critical difference
            hsd = q_crit * se
            
            significant = "*" if mean_diff > hsd else "ns"
            
            print(f"Group {i+1} vs Group {j+1}:")
            print(f"  Mean difference: {mean_diff:.4f}")
            print(f"  HSD threshold: {hsd:.4f}")
            print(f"  Significant: {significant}")
            print()

# Example: Comparing test scores across three teaching methods
print("=" * 60)
print("One-Way ANOVA Example: Test Scores by Teaching Method")
print("=" * 60)

# Three groups: different teaching methods
method_A = np.array([85, 88, 90, 87, 92, 86, 89, 91])
method_B = np.array([78, 82, 80, 85, 79, 83, 81, 84])
method_C = np.array([92, 95, 93, 97, 94, 96, 98, 95])

print("\nData:")
print(f"Method A (n={len(method_A)}): {method_A}")
print(f"  Mean: {np.mean(method_A):.2f}, Std: {np.std(method_A, ddof=1):.2f}")
print(f"\nMethod B (n={len(method_B)}): {method_B}")
print(f"  Mean: {np.mean(method_B):.2f}, Std: {np.std(method_B, ddof=1):.2f}")
print(f"\nMethod C (n={len(method_C)}): {method_C}")
print(f"  Mean: {np.mean(method_C):.2f}, Std: {np.std(method_C, ddof=1):.2f}")

# Perform ANOVA
f_stat, p_val, anova_table = one_way_anova(method_A, method_B, method_C)

print_anova_table(anova_table)

print(f"\nF-statistic: {f_stat:.4f}")
print(f"P-value: {p_val:.6f}")

alpha = 0.05
if p_val < alpha:
    print(f"\nConclusion (α={alpha}): Reject null hypothesis")
    print("There are significant differences between the groups")
    
    # Perform post-hoc test
    tukey_hsd([method_A, method_B, method_C], alpha)
else:
    print(f"\nConclusion (α={alpha}): Fail to reject null hypothesis")
    print("No significant differences between the groups")

# Verification using scipy
print("\n" + "=" * 60)
print("Verification using scipy.stats.f_oneway")
print("=" * 60)
f_scipy, p_scipy = stats.f_oneway(method_A, method_B, method_C)
print(f"F-statistic: {f_scipy:.4f}")
print(f"P-value: {p_scipy:.6f}")
`,
    'Java': `import java.util.Arrays;

public class OneWayANOVA {
    
    public static class ANOVAResult {
        public double fStatistic;
        public double pValue;
        public double ssb;  // Sum of Squares Between
        public double ssw;  // Sum of Squares Within
        public double sst;  // Total Sum of Squares
        public int dfBetween;
        public int dfWithin;
        public double msb;  // Mean Square Between
        public double msw;  // Mean Square Within
        
        public ANOVAResult(double f, double p, double ssb, double ssw, 
                          int dfB, int dfW, double msb, double msw) {
            this.fStatistic = f;
            this.pValue = p;
            this.ssb = ssb;
            this.ssw = ssw;
            this.sst = ssb + ssw;
            this.dfBetween = dfB;
            this.dfWithin = dfW;
            this.msb = msb;
            this.msw = msw;
        }
    }
    
    public static double mean(double[] data) {
        double sum = 0;
        for (double val : data) {
            sum += val;
        }
        return sum / data.length;
    }
    
    public static ANOVAResult performANOVA(double[]... groups) {
        int k = groups.length;  // Number of groups
        int nTotal = 0;
        
        // Calculate total observations
        for (double[] group : groups) {
            nTotal += group.length;
        }
        
        // Calculate group means
        double[] groupMeans = new double[k];
        for (int i = 0; i < k; i++) {
            groupMeans[i] = mean(groups[i]);
        }
        
        // Calculate grand mean
        double grandMean = 0;
        for (int i = 0; i < k; i++) {
            grandMean += groupMeans[i] * groups[i].length;
        }
        grandMean /= nTotal;
        
        // Calculate Sum of Squares Between (SSB)
        double ssb = 0;
        for (int i = 0; i < k; i++) {
            double diff = groupMeans[i] - grandMean;
            ssb += groups[i].length * diff * diff;
        }
        
        // Calculate Sum of Squares Within (SSW)
        double ssw = 0;
        for (int i = 0; i < k; i++) {
            for (double val : groups[i]) {
                double diff = val - groupMeans[i];
                ssw += diff * diff;
            }
        }
        
        // Degrees of freedom
        int dfBetween = k - 1;
        int dfWithin = nTotal - k;
        
        // Mean Squares
        double msb = ssb / dfBetween;
        double msw = ssw / dfWithin;
        
        // F-statistic
        double fStatistic = msb / msw;
        
        // P-value (approximation using F-distribution)
        double pValue = 1 - fCDF(fStatistic, dfBetween, dfWithin);
        
        return new ANOVAResult(fStatistic, pValue, ssb, ssw, 
                              dfBetween, dfWithin, msb, msw);
    }
    
    // F-distribution CDF (approximation)
    private static double fCDF(double x, int d1, int d2) {
        if (x <= 0) return 0;
        
        // Using incomplete beta function approximation
        double a = d1 / 2.0;
        double b = d2 / 2.0;
        double z = (d1 * x) / (d1 * x + d2);
        
        return incompleteBeta(z, a, b);
    }
    
    // Incomplete beta function (approximation)
    private static double incompleteBeta(double x, double a, double b) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        
        // Simple series approximation
        double sum = 0;
        double term = 1;
        
        for (int n = 0; n < 100; n++) {
            term = Math.pow(x, a + n) * Math.pow(1 - x, b) / (a + n);
            sum += term / beta(a + n, b);
            if (Math.abs(term) < 1e-10) break;
        }
        
        return sum;
    }
    
    // Beta function
    private static double beta(double a, double b) {
        return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
    }
    
    // Log gamma function
    private static double logGamma(double x) {
        double[] coef = {
            76.18009172947146, -86.50532032941677,
            24.01409824083091, -1.231739572450155,
            0.001208650973866179, -0.000005395239384953
        };
        
        double y = x;
        double tmp = x + 5.5;
        tmp -= (x + 0.5) * Math.log(tmp);
        double ser = 1.000000000190015;
        
        for (int j = 0; j < 6; j++) {
            ser += coef[j] / ++y;
        }
        
        return -tmp + Math.log(2.5066282746310005 * ser / x);
    }
    
    public static void printANOVATable(ANOVAResult result) {
        System.out.println("\nANOVA Table:");
        System.out.println("=".repeat(80));
        System.out.printf("%-20s %-15s %-10s %-15s %-15s %-15s\n",
                         "Source", "SS", "df", "MS", "F", "P-value");
        System.out.println("=".repeat(80));
        
        System.out.printf("%-20s %-15.4f %-10d %-15.4f %-15.4f %-15.6f\n",
                         "Between Groups", result.ssb, result.dfBetween, 
                         result.msb, result.fStatistic, result.pValue);
        
        System.out.printf("%-20s %-15.4f %-10d %-15.4f\n",
                         "Within Groups", result.ssw, result.dfWithin, result.msw);
        
        System.out.printf("%-20s %-15.4f %-10d\n",
                         "Total", result.sst, result.dfBetween + result.dfWithin);
        
        System.out.println("=".repeat(80));
    }
    
    public static void main(String[] args) {
        System.out.println("One-Way ANOVA Example: Test Scores by Teaching Method");
        System.out.println("=".repeat(60));
        
        double[] methodA = {85, 88, 90, 87, 92, 86, 89, 91};
        double[] methodB = {78, 82, 80, 85, 79, 83, 81, 84};
        double[] methodC = {92, 95, 93, 97, 94, 96, 98, 95};
        
        System.out.println("\nData:");
        System.out.printf("Method A: %s (mean=%.2f)\n", 
                         Arrays.toString(methodA), mean(methodA));
        System.out.printf("Method B: %s (mean=%.2f)\n", 
                         Arrays.toString(methodB), mean(methodB));
        System.out.printf("Method C: %s (mean=%.2f)\n", 
                         Arrays.toString(methodC), mean(methodC));
        
        ANOVAResult result = performANOVA(methodA, methodB, methodC);
        
        printANOVATable(result);
        
        System.out.printf("\nF-statistic: %.4f\n", result.fStatistic);
        System.out.printf("P-value: %.6f\n", result.pValue);
        
        double alpha = 0.05;
        if (result.pValue < alpha) {
            System.out.printf("\nConclusion (α=%.2f): Reject null hypothesis\n", alpha);
            System.out.println("There are significant differences between the groups");
        } else {
            System.out.printf("\nConclusion (α=%.2f): Fail to reject null hypothesis\n", alpha);
            System.out.println("No significant differences between the groups");
        }
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <numeric>
#include <iomanip>

using namespace std;

struct ANOVAResult {
    double fStatistic;
    double pValue;
    double ssb;  // Sum of Squares Between
    double ssw;  // Sum of Squares Within
    double sst;  // Total Sum of Squares
    int dfBetween;
    int dfWithin;
    double msb;  // Mean Square Between
    double msw;  // Mean Square Within
};

class OneWayANOVA {
public:
    static double mean(const vector<double>& data) {
        return accumulate(data.begin(), data.end(), 0.0) / data.size();
    }
    
    static ANOVAResult performANOVA(const vector<vector<double>>& groups) {
        int k = groups.size();  // Number of groups
        int nTotal = 0;
        
        // Calculate total observations
        for (const auto& group : groups) {
            nTotal += group.size();
        }
        
        // Calculate group means
        vector<double> groupMeans;
        for (const auto& group : groups) {
            groupMeans.push_back(mean(group));
        }
        
        // Calculate grand mean
        double grandMean = 0;
        for (size_t i = 0; i < groups.size(); i++) {
            grandMean += groupMeans[i] * groups[i].size();
        }
        grandMean /= nTotal;
        
        // Calculate Sum of Squares Between (SSB)
        double ssb = 0;
        for (size_t i = 0; i < groups.size(); i++) {
            double diff = groupMeans[i] - grandMean;
            ssb += groups[i].size() * diff * diff;
        }
        
        // Calculate Sum of Squares Within (SSW)
        double ssw = 0;
        for (size_t i = 0; i < groups.size(); i++) {
            for (double val : groups[i]) {
                double diff = val - groupMeans[i];
                ssw += diff * diff;
            }
        }
        
        // Degrees of freedom
        int dfBetween = k - 1;
        int dfWithin = nTotal - k;
        
        // Mean Squares
        double msb = ssb / dfBetween;
        double msw = ssw / dfWithin;
        
        // F-statistic
        double fStatistic = msb / msw;
        
        // P-value (approximation)
        double pValue = 1 - fCDF(fStatistic, dfBetween, dfWithin);
        
        return {fStatistic, pValue, ssb, ssw, ssb + ssw, 
                dfBetween, dfWithin, msb, msw};
    }
    
    static void printANOVATable(const ANOVAResult& result) {
        cout << "\nANOVA Table:" << endl;
        cout << string(80, '=') << endl;
        cout << left << setw(20) << "Source" 
             << setw(15) << "SS" 
             << setw(10) << "df" 
             << setw(15) << "MS" 
             << setw(15) << "F" 
             << setw(15) << "P-value" << endl;
        cout << string(80, '=') << endl;
        
        cout << fixed << setprecision(4);
        cout << left << setw(20) << "Between Groups" 
             << setw(15) << result.ssb 
             << setw(10) << result.dfBetween 
             << setw(15) << result.msb 
             << setw(15) << result.fStatistic 
             << setw(15) << result.pValue << endl;
        
        cout << left << setw(20) << "Within Groups" 
             << setw(15) << result.ssw 
             << setw(10) << result.dfWithin 
             << setw(15) << result.msw << endl;
        
        cout << left << setw(20) << "Total" 
             << setw(15) << result.sst 
             << setw(10) << (result.dfBetween + result.dfWithin) << endl;
        
        cout << string(80, '=') << endl;
    }
    
private:
    // F-distribution CDF (approximation)
    static double fCDF(double x, int d1, int d2) {
        if (x <= 0) return 0;
        
        double a = d1 / 2.0;
        double b = d2 / 2.0;
        double z = (d1 * x) / (d1 * x + d2);
        
        return incompleteBeta(z, a, b);
    }
    
    // Incomplete beta function (approximation)
    static double incompleteBeta(double x, double a, double b) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        
        double sum = 0;
        double term = 1;
        
        for (int n = 0; n < 100; n++) {
            term = pow(x, a + n) * pow(1 - x, b) / (a + n);
            sum += term / beta(a + n, b);
            if (abs(term) < 1e-10) break;
        }
        
        return sum;
    }
    
    // Beta function
    static double beta(double a, double b) {
        return exp(logGamma(a) + logGamma(b) - logGamma(a + b));
    }
    
    // Log gamma function
    static double logGamma(double x) {
        double coef[] = {
            76.18009172947146, -86.50532032941677,
            24.01409824083091, -1.231739572450155,
            0.001208650973866179, -0.000005395239384953
        };
        
        double y = x;
        double tmp = x + 5.5;
        tmp -= (x + 0.5) * log(tmp);
        double ser = 1.000000000190015;
        
        for (int j = 0; j < 6; j++) {
            ser += coef[j] / ++y;
        }
        
        return -tmp + log(2.5066282746310005 * ser / x);
    }
};

int main() {
    cout << "One-Way ANOVA Example: Test Scores by Teaching Method" << endl;
    cout << string(60, '=') << endl;
    
    vector<vector<double>> groups = {
        {85, 88, 90, 87, 92, 86, 89, 91},
        {78, 82, 80, 85, 79, 83, 81, 84},
        {92, 95, 93, 97, 94, 96, 98, 95}
    };
    
    cout << fixed << setprecision(2);
    cout << "\nData:" << endl;
    for (size_t i = 0; i < groups.size(); i++) {
        cout << "Method " << (char)('A' + i) << ": mean=" 
             << OneWayANOVA::mean(groups[i]) << endl;
    }
    
    auto result = OneWayANOVA::performANOVA(groups);
    
    OneWayANOVA::printANOVATable(result);
    
    cout << fixed << setprecision(4);
    cout << "\nF-statistic: " << result.fStatistic << endl;
    cout << "P-value: " << result.pValue << endl;
    
    double alpha = 0.05;
    if (result.pValue < alpha) {
        cout << "\nConclusion (α=" << alpha << "): Reject null hypothesis" << endl;
        cout << "There are significant differences between the groups" << endl;
    } else {
        cout << "\nConclusion (α=" << alpha << "): Fail to reject null hypothesis" << endl;
        cout << "No significant differences between the groups" << endl;
    }
    
    return 0;
}
`
};
