export const chiSquareCode = {
    'Python': `import numpy as np
from scipy import stats
import math

def chi_square_test(observed, expected=None):
    """
    Perform Chi-Square Goodness of Fit Test
    
    observed: array of observed frequencies
    expected: array of expected frequencies (if None, assumes uniform)
    
    Returns: chi_square statistic, p-value, degrees of freedom
    """
    observed = np.array(observed)
    
    if expected is None:
        # Uniform distribution
        expected = np.ones_like(observed) * np.mean(observed)
    else:
        expected = np.array(expected)
    
    # Chi-square statistic: sum((O - E)^2 / E)
    chi_square = np.sum((observed - expected)**2 / expected)
    
    # Degrees of freedom
    df = len(observed) - 1
    
    # P-value
    p_value = 1 - stats.chi2.cdf(chi_square, df)
    
    return chi_square, p_value, df

def chi_square_independence(contingency_table):
    """
    Chi-Square Test of Independence for contingency tables
    
    contingency_table: 2D array (rows x columns)
    
    Returns: chi_square, p_value, df, expected_frequencies
    """
    observed = np.array(contingency_table)
    
    # Calculate row and column totals
    row_totals = observed.sum(axis=1)
    col_totals = observed.sum(axis=0)
    total = observed.sum()
    
    # Calculate expected frequencies
    expected = np.outer(row_totals, col_totals) / total
    
    # Chi-square statistic
    chi_square = np.sum((observed - expected)**2 / expected)
    
    # Degrees of freedom: (rows - 1) * (cols - 1)
    df = (observed.shape[0] - 1) * (observed.shape[1] - 1)
    
    # P-value
    p_value = 1 - stats.chi2.cdf(chi_square, df)
    
    return chi_square, p_value, df, expected

def chi_square_manual(observed, expected):
    """
    Manual calculation of chi-square statistic
    """
    chi_square = 0
    for obs, exp in zip(observed, expected):
        if exp > 0:
            chi_square += (obs - exp)**2 / exp
    return chi_square

def critical_value(alpha, df):
    """
    Get critical value for chi-square distribution
    alpha: significance level (e.g., 0.05)
    df: degrees of freedom
    """
    return stats.chi2.ppf(1 - alpha, df)

# Example 1: Goodness of Fit Test
print("=" * 50)
print("Example 1: Chi-Square Goodness of Fit Test")
print("=" * 50)

# Die roll experiment: observed frequencies for 1-6
observed_dice = np.array([15, 18, 12, 20, 17, 18])
expected_dice = np.array([16.67, 16.67, 16.67, 16.67, 16.67, 16.67])

chi2, p_val, df = chi_square_test(observed_dice, expected_dice)

print(f"Observed frequencies: {observed_dice}")
print(f"Expected frequencies: {expected_dice}")
print(f"\nChi-Square Statistic: {chi2:.4f}")
print(f"Degrees of Freedom: {df}")
print(f"P-value: {p_val:.4f}")
print(f"Critical value (α=0.05): {critical_value(0.05, df):.4f}")

if p_val < 0.05:
    print("\nConclusion: Reject null hypothesis (die is biased)")
else:
    print("\nConclusion: Fail to reject null hypothesis (die is fair)")

# Example 2: Test of Independence
print("\n" + "=" * 50)
print("Example 2: Chi-Square Test of Independence")
print("=" * 50)

# Contingency table: Gender vs. Preference
# Rows: Male, Female
# Columns: Product A, Product B, Product C
contingency = np.array([
    [30, 20, 10],  # Male
    [20, 30, 20]   # Female
])

chi2, p_val, df, expected = chi_square_independence(contingency)

print("\nObserved Frequencies:")
print("         Product A  Product B  Product C")
print(f"Male        {contingency[0, 0]:3d}       {contingency[0, 1]:3d}       {contingency[0, 2]:3d}")
print(f"Female      {contingency[1, 0]:3d}       {contingency[1, 1]:3d}       {contingency[1, 2]:3d}")

print("\nExpected Frequencies:")
print("         Product A  Product B  Product C")
print(f"Male      {expected[0, 0]:6.2f}    {expected[0, 1]:6.2f}    {expected[0, 2]:6.2f}")
print(f"Female    {expected[1, 0]:6.2f}    {expected[1, 1]:6.2f}    {expected[1, 2]:6.2f}")

print(f"\nChi-Square Statistic: {chi2:.4f}")
print(f"Degrees of Freedom: {df}")
print(f"P-value: {p_val:.4f}")
print(f"Critical value (α=0.05): {critical_value(0.05, df):.4f}")

if p_val < 0.05:
    print("\nConclusion: Reject null hypothesis")
    print("Gender and product preference are dependent")
else:
    print("\nConclusion: Fail to reject null hypothesis")
    print("Gender and product preference are independent")

# Using scipy for validation
print("\n" + "=" * 50)
print("Validation using scipy.stats")
print("=" * 50)
chi2_scipy, p_scipy, dof_scipy, expected_scipy = stats.chi2_contingency(contingency)
print(f"Chi-Square: {chi2_scipy:.4f}")
print(f"P-value: {p_scipy:.4f}")
`,
    'Java': `import java.util.Arrays;

public class ChiSquareTest {
    
    public static class ChiSquareResult {
        public double chiSquare;
        public double pValue;
        public int degreesOfFreedom;
        
        public ChiSquareResult(double chiSquare, double pValue, int df) {
            this.chiSquare = chiSquare;
            this.pValue = pValue;
            this.degreesOfFreedom = df;
        }
    }
    
    public static double calculateChiSquare(double[] observed, double[] expected) {
        if (observed.length != expected.length) {
            throw new IllegalArgumentException("Arrays must have same length");
        }
        
        double chiSquare = 0;
        for (int i = 0; i < observed.length; i++) {
            if (expected[i] > 0) {
                double diff = observed[i] - expected[i];
                chiSquare += (diff * diff) / expected[i];
            }
        }
        
        return chiSquare;
    }
    
    public static ChiSquareResult goodnessOfFit(double[] observed, double[] expected) {
        double chiSquare = calculateChiSquare(observed, expected);
        int df = observed.length - 1;
        double pValue = 1 - chiSquareCDF(chiSquare, df);
        
        return new ChiSquareResult(chiSquare, pValue, df);
    }
    
    public static ChiSquareResult testOfIndependence(double[][] contingencyTable) {
        int rows = contingencyTable.length;
        int cols = contingencyTable[0].length;
        
        // Calculate row and column totals
        double[] rowTotals = new double[rows];
        double[] colTotals = new double[cols];
        double total = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                rowTotals[i] += contingencyTable[i][j];
                colTotals[j] += contingencyTable[i][j];
                total += contingencyTable[i][j];
            }
        }
        
        // Calculate expected frequencies and chi-square
        double chiSquare = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                double expected = (rowTotals[i] * colTotals[j]) / total;
                double observed = contingencyTable[i][j];
                double diff = observed - expected;
                chiSquare += (diff * diff) / expected;
            }
        }
        
        int df = (rows - 1) * (cols - 1);
        double pValue = 1 - chiSquareCDF(chiSquare, df);
        
        return new ChiSquareResult(chiSquare, pValue, df);
    }
    
    // Approximate chi-square CDF using gamma function
    private static double chiSquareCDF(double x, int k) {
        return incompleteGamma(k / 2.0, x / 2.0);
    }
    
    // Incomplete gamma function (approximation)
    private static double incompleteGamma(double a, double x) {
        if (x < 0 || a <= 0) return 0;
        
        // Series expansion
        double sum = 0;
        double term = 1.0 / a;
        sum = term;
        
        for (int n = 1; n < 100; n++) {
            term *= x / (a + n);
            sum += term;
            if (Math.abs(term) < 1e-10) break;
        }
        
        return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
    }
    
    // Log gamma function (approximation)
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
    
    public static void main(String[] args) {
        // Example 1: Goodness of Fit
        System.out.println("Chi-Square Goodness of Fit Test");
        System.out.println("=" .repeat(40));
        
        double[] observed = {15, 18, 12, 20, 17, 18};
        double[] expected = {16.67, 16.67, 16.67, 16.67, 16.67, 16.67};
        
        ChiSquareResult result1 = goodnessOfFit(observed, expected);
        
        System.out.println("Observed: " + Arrays.toString(observed));
        System.out.println("Expected: " + Arrays.toString(expected));
        System.out.printf("\nChi-Square: %.4f\n", result1.chiSquare);
        System.out.printf("Degrees of Freedom: %d\n", result1.degreesOfFreedom);
        System.out.printf("P-value: %.4f\n", result1.pValue);
        
        // Example 2: Test of Independence
        System.out.println("\nChi-Square Test of Independence");
        System.out.println("=" .repeat(40));
        
        double[][] contingency = {
            {30, 20, 10},
            {20, 30, 20}
        };
        
        ChiSquareResult result2 = testOfIndependence(contingency);
        
        System.out.printf("Chi-Square: %.4f\n", result2.chiSquare);
        System.out.printf("Degrees of Freedom: %d\n", result2.degreesOfFreedom);
        System.out.printf("P-value: %.4f\n", result2.pValue);
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

using namespace std;

struct ChiSquareResult {
    double chiSquare;
    double pValue;
    int degreesOfFreedom;
};

class ChiSquareTest {
public:
    static double calculateChiSquare(const vector<double>& observed,
                                    const vector<double>& expected) {
        if (observed.size() != expected.size()) {
            throw invalid_argument("Arrays must have same length");
        }
        
        double chiSquare = 0;
        for (size_t i = 0; i < observed.size(); i++) {
            if (expected[i] > 0) {
                double diff = observed[i] - expected[i];
                chiSquare += (diff * diff) / expected[i];
            }
        }
        
        return chiSquare;
    }
    
    static ChiSquareResult goodnessOfFit(const vector<double>& observed,
                                        const vector<double>& expected) {
        double chiSquare = calculateChiSquare(observed, expected);
        int df = observed.size() - 1;
        double pValue = 1 - chiSquareCDF(chiSquare, df);
        
        return {chiSquare, pValue, df};
    }
    
    static ChiSquareResult testOfIndependence(
            const vector<vector<double>>& contingencyTable) {
        
        int rows = contingencyTable.size();
        int cols = contingencyTable[0].size();
        
        // Calculate totals
        vector<double> rowTotals(rows, 0);
        vector<double> colTotals(cols, 0);
        double total = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                rowTotals[i] += contingencyTable[i][j];
                colTotals[j] += contingencyTable[i][j];
                total += contingencyTable[i][j];
            }
        }
        
        // Calculate chi-square
        double chiSquare = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                double expected = (rowTotals[i] * colTotals[j]) / total;
                double observed = contingencyTable[i][j];
                double diff = observed - expected;
                chiSquare += (diff * diff) / expected;
            }
        }
        
        int df = (rows - 1) * (cols - 1);
        double pValue = 1 - chiSquareCDF(chiSquare, df);
        
        return {chiSquare, pValue, df};
    }
    
private:
    // Chi-square CDF approximation
    static double chiSquareCDF(double x, int k) {
        if (x <= 0) return 0;
        if (k == 0) return 1;
        
        return incompleteGamma(k / 2.0, x / 2.0);
    }
    
    // Incomplete gamma function (approximation)
    static double incompleteGamma(double a, double x) {
        if (x < 0 || a <= 0) return 0;
        
        double sum = 0;
        double term = 1.0 / a;
        sum = term;
        
        for (int n = 1; n < 100; n++) {
            term *= x / (a + n);
            sum += term;
            if (abs(term) < 1e-10) break;
        }
        
        return sum * exp(-x + a * log(x) - logGamma(a));
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
    // Example 1: Goodness of Fit
    cout << "Chi-Square Goodness of Fit Test" << endl;
    cout << string(40, '=') << endl;
    
    vector<double> observed = {15, 18, 12, 20, 17, 18};
    vector<double> expected = {16.67, 16.67, 16.67, 16.67, 16.67, 16.67};
    
    auto result1 = ChiSquareTest::goodnessOfFit(observed, expected);
    
    cout << fixed << setprecision(4);
    cout << "Chi-Square: " << result1.chiSquare << endl;
    cout << "Degrees of Freedom: " << result1.degreesOfFreedom << endl;
    cout << "P-value: " << result1.pValue << endl;
    
    // Example 2: Test of Independence
    cout << "\nChi-Square Test of Independence" << endl;
    cout << string(40, '=') << endl;
    
    vector<vector<double>> contingency = {
        {30, 20, 10},
        {20, 30, 20}
    };
    
    auto result2 = ChiSquareTest::testOfIndependence(contingency);
    
    cout << "Chi-Square: " << result2.chiSquare << endl;
    cout << "Degrees of Freedom: " << result2.degreesOfFreedom << endl;
    cout << "P-value: " << result2.pValue << endl;
    
    return 0;
}
`
};
