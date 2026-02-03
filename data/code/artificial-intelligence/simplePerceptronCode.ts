
export const simplePerceptronCode = {
    'Python': `def train_perceptron(data, learning_rate, epochs):
    """
    A simple perceptron for binary classification.
    data = list of tuples [(x1, x2, ..., label), ...]
    """
    # Initialize weights and bias to 0
    num_features = len(data[0]) - 1
    weights = [0.0] * num_features
    bias = 0.0

    for epoch in range(epochs):
        print(f"Epoch {epoch + 1}")
        for row in data:
            features = row[:-1]
            label = row[-1]

            # Make a prediction
            activation = bias
            for i in range(num_features):
                activation += weights[i] * features[i]
            
            prediction = 1 if activation >= 0.0 else 0

            # Calculate error
            error = label - prediction
            
            # Update weights and bias
            bias = bias + learning_rate * error
            for i in range(num_features):
                weights[i] = weights[i] + learning_rate * error * features[i]
        print(f"  Weights: {[f'{w:.2f}' for w in weights]}, Bias: {bias:.2f}")

    return weights, bias

# Example: AND gate
# Data: [x1, x2, label]
and_data = [
    (0, 0, 0),
    (0, 1, 0),
    (1, 0, 0),
    (1, 1, 1)
]

learning_rate = 0.1
epochs = 10
weights, bias = train_perceptron(and_data, learning_rate, epochs)
`,
    'Java': `import java.util.Arrays;

public class Perceptron {

    private double[] weights;
    private double bias;
    private final double learningRate;

    public Perceptron(int numFeatures, double learningRate) {
        this.weights = new double[numFeatures];
        this.bias = 0.0;
        this.learningRate = learningRate;
    }

    public int predict(double[] inputs) {
        double activation = bias;
        for (int i = 0; i < weights.length; i++) {
            activation += weights[i] * inputs[i];
        }
        return (activation >= 0.0) ? 1 : 0;
    }

    public void train(double[][] trainingData, int epochs) {
        for (int epoch = 0; epoch < epochs; epoch++) {
            System.out.println("Epoch " + (epoch + 1));
            for (double[] row : trainingData) {
                double[] inputs = Arrays.copyOfRange(row, 0, weights.length);
                int label = (int) row[weights.length];
                
                int prediction = predict(inputs);
                double error = label - prediction;

                bias += learningRate * error;
                for (int i = 0; i < weights.length; i++) {
                    weights[i] += learningRate * error * inputs[i];
                }
            }
            System.out.println("  Weights: " + Arrays.toString(weights) + ", Bias: " + bias);
        }
    }

    public static void main(String[] args) {
        // AND gate data
        double[][] data = {{0, 0, 0}, {0, 1, 0}, {1, 0, 0}, {1, 1, 1}};
        Perceptron p = new Perceptron(2, 0.1);
        p.train(data, 10);
    }
}
`,
    'C++': `#include <iostream>
#include <vector>
#include <numeric>

class Perceptron {
    std::vector<double> weights;
    double bias;
    double learningRate;

public:
    Perceptron(int numFeatures, double lr) : learningRate(lr), bias(0.0) {
        weights.assign(numFeatures, 0.0);
    }

    int predict(const std::vector<double>& inputs) {
        double activation = bias;
        for (size_t i = 0; i < weights.size(); ++i) {
            activation += weights[i] * inputs[i];
        }
        return (activation >= 0.0) ? 1 : 0;
    }

    void train(const std::vector<std::vector<double>>& trainingData, int epochs) {
        for (int epoch = 0; epoch < epochs; ++epoch) {
            std::cout << "Epoch " << epoch + 1 << std::endl;
            for (const auto& row : trainingData) {
                std::vector<double> inputs(row.begin(), row.end() - 1);
                int label = static_cast<int>(row.back());
                
                int prediction = predict(inputs);
                double error = label - prediction;

                bias += learningRate * error;
                for (size_t i = 0; i < weights.size(); ++i) {
                    weights[i] += learningRate * error * inputs[i];
                }
            }
        }
    }
};

int main() {
    std::vector<std::vector<double>> data = {{0, 0, 0}, {0, 1, 0}, {1, 0, 0}, {1, 1, 1}};
    Perceptron p(2, 0.1);
    p.train(data, 10);
    return 0;
}
`
};
