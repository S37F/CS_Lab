
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const LinearRegressionArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Simple Linear Regression is a statistical method that allows us to summarize and study relationships between two continuous (quantitative) variables. It models the relationship by fitting a linear equation to the observed data.</p>
                <p>The goal is to find the "line of best fit" that can be used to describe the relationship and make predictions.</p>
            </Section>

            <Section title="The Regression Equation">
                <p>The equation for a simple linear regression line is:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>Y = β₀ + β₁X</code>
                 <ul className="list-disc list-inside space-y-2">
                    <li><strong>Y:</strong> The dependent variable (what we are trying to predict).</li>
                    <li><strong>X:</strong> The independent variable (the predictor).</li>
                    <li><strong>β₀:</strong> The y-intercept of the line.</li>
                    <li><strong>β₁:</strong> The slope of the line, which represents the change in Y for a one-unit change in X.</li>
                </ul>
            </Section>

            <Section title="Method of Least Squares">
                <p>To find the "best" line, we use the method of least squares. This method finds the values of β₀ and β₁ that minimize the sum of the squared differences between the observed values of Y and the values predicted by the regression line. These differences are called "residuals."</p>
                <p>By minimizing the sum of squared residuals, we find the unique line that is, on average, closest to all of the data points.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default LinearRegressionArticle;
