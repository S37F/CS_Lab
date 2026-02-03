
export const linearRegressionCode = {
    'Python': `def simple_linear_regression(x, y):
    """
    Calculates the coefficients (slope and intercept) for a simple linear regression line.
    y = b0 + b1 * x
    """
    n = len(x)
    if n == 0:
        return 0, 0
        
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    
    # Calculate slope (b1) and intercept (b0)
    # b1 = sum((x_i - mean_x) * (y_i - mean_y)) / sum((x_i - mean_x)^2)
    numerator = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y))
    denominator = sum((xi - mean_x)**2 for xi in x)
    
    if denominator == 0:
        return 0, mean_y # Vertical line, slope is undefined, return mean y
    
    b1 = numerator / denominator
    b0 = mean_y - b1 * mean_x
    
    return b0, b1

def r_squared(x, y, b0, b1):
    """Calculates the R-squared value (coefficient of determination)."""
    n = len(y)
    mean_y = sum(y) / n
    
    # Total sum of squares
    ss_total = sum((yi - mean_y)**2 for yi in y)
    if ss_total == 0: return 1.0 # All points are the same
    
    # Residual sum of squares
    ss_residual = sum((yi - (b0 + b1 * xi))**2 for xi, yi in zip(x, y))
    
    r2 = 1 - (ss_residual / ss_total)
    return r2

# Example
x_data = [1, 2, 3, 4, 5]
y_data = [2, 3, 5, 4, 6]

b0, b1 = simple_linear_regression(x_data, y_data)
r2 = r_squared(x_data, y_data, b0, b1)

print(f"Regression Line: y = {b0:.2f} + {b1:.2f} * x")
print(f"R-squared: {r2:.4f}")
`,
    'Java': `public class SimpleLinearRegression {

    private final double intercept, slope;

    public SimpleLinearRegression(double[] x, double[] y) {
        if (x.length != y.length) {
            throw new IllegalArgumentException("Array lengths must be equal.");
        }
        int n = x.length;

        double sumX = 0.0, sumY = 0.0;
        for (int i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
        }
        double meanX = sumX / n;
        double meanY = sumY / n;

        double numerator = 0.0;
        double denominator = 0.0;
        for (int i = 0; i < n; i++) {
            numerator += (x[i] - meanX) * (y[i] - meanY);
            denominator += (x[i] - meanX) * (x[i] - meanX);
        }
        
        slope = numerator / denominator;
        intercept = meanY - slope * meanX;
    }
    
    // ... methods to get slope, intercept, and calculate R-squared ...

    public static void main(String[] args) {
        double[] x = {1, 2, 3, 4, 5};
        double[] y = {2, 3, 5, 4, 6};
        SimpleLinearRegression lr = new SimpleLinearRegression(x, y);
        System.out.printf("y = %.2f + %.2f * x\\n", lr.intercept, lr.slope);
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <numeric>

struct RegressionResult {
    double intercept;
    double slope;
};

RegressionResult simpleLinearRegression(const std::vector<double>& x, const std::vector<double>& y) {
    if (x.size() != y.size() || x.empty()) {
        return {0, 0};
    }
    int n = x.size();
    
    double sum_x = std::accumulate(x.begin(), x.end(), 0.0);
    double sum_y = std::accumulate(y.begin(), y.end(), 0.0);
    double mean_x = sum_x / n;
    double mean_y = sum_y / n;

    double numerator = 0.0;
    double denominator = 0.0;
    for(int i = 0; i < n; ++i) {
        numerator += (x[i] - mean_x) * (y[i] - mean_y);
        denominator += (x[i] - mean_x) * (x[i] - mean_x);
    }

    if (denominator == 0) return {mean_y, 0};

    double slope = numerator / denominator;
    double intercept = mean_y - slope * mean_x;
    
    return {intercept, slope};
}

int main() {
    std::vector<double> x = {1, 2, 3, 4, 5};
    std::vector<double> y = {2, 3, 5, 4, 6};
    
    RegressionResult result = simpleLinearRegression(x, y);
    
    std::cout << "y = " << result.intercept << " + " << result.slope << " * x" << std::endl;
    
    return 0;
}
`
};
