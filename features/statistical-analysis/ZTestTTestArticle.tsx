
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const ZTestTTestArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Hypothesis Testing">
                <p>The Z-test and T-test are statistical tests used in hypothesis testing to determine whether two population means are different or whether a sample mean is different from a hypothesized population mean. They are used to decide whether to support or reject a null hypothesis.</p>
            </Section>

            <Section title="Z-Test vs. T-Test">
                <p>The key difference lies in the conditions under which they are used:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>A <strong>Z-test</strong> is used when the population variance (or standard deviation) is known, or when the sample size is large (typically n &gt; 30), as the sample variance is a good approximation of the population variance.</li>
                    <li>A <strong>T-test</strong> is used when the population variance is unknown and the sample size is small (n &lt; 30). The t-distribution is used instead of the normal distribution to account for the extra uncertainty introduced by estimating the population variance from the sample.</li>
                </ul>
            </Section>

            <Section title="P-Values and Significance">
                <p>Both tests produce a test statistic (a Z-score or T-score) and a corresponding <strong>p-value</strong>.</p>
                <p>The p-value is the probability of observing a test statistic as extreme as, or more extreme than, the one calculated from your sample data, assuming the null hypothesis is true. A small p-value (typically ≤ 0.05) indicates strong evidence against the null hypothesis, so you reject the null hypothesis.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default ZTestTTestArticle;
