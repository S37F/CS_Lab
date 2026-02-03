
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SimplePerceptronArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>The Perceptron is one of the oldest and simplest machine learning algorithms, invented in 1957 by Frank Rosenblatt. It is a type of linear classifier, meaning it makes its predictions based on a linear predictor function combining a set of weights with the feature vector. It is the fundamental building block of neural networks.</p>
                <p>The goal is to find a "decision boundary" (a line, in 2D) that separates data points into two classes.</p>
            </Section>

            <Section title="How It Works">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Inputs & Weights:</strong> The perceptron takes multiple binary inputs, `x1, x2, ...`, and produces a single binary output. Each input has an associated weight, `w1, w2, ...`.</li>
                    <li><strong>Summation:</strong> It computes a weighted sum of its inputs: `sum = Σ(wi * xi)`.</li>
                    <li><strong>Activation Function:</strong> The output is determined by an activation function (typically a step function). If the weighted sum is greater than a certain threshold (or bias), the output is 1; otherwise, it is 0.</li>
                </ol>
            </Section>

            <Section title="The Learning Rule">
                <p>The perceptron learns by adjusting its weights and bias after each misclassification.</p>
                <p>For each training example (inputs, actual label):</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Make a prediction.</li>
                    <li>Calculate the error: `error = actual_label - prediction`.</li>
                    <li>Update each weight: `new_weight = old_weight + learning_rate * error * input`.</li>
                    <li>Update the bias: `new_bias = old_bias + learning_rate * error`.</li>
                </ol>
                <p>This process is repeated for a number of epochs, or until the model converges and makes no more mistakes on the training data.</p>
            </Section>

            <Section title="Limitations">
                <p>The single-layer perceptron has a major limitation: it can only learn linearly separable patterns. It cannot solve problems where the two classes are not separable by a straight line. The classic example of this is the XOR problem. This limitation was a major factor in the first "AI winter" and led to the development of multi-layer perceptrons (neural networks).</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SimplePerceptronArticle;
