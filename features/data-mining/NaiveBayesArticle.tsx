
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const NaiveBayesArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Naïve Bayes classifiers are a family of simple probabilistic classifiers based on applying Bayes' theorem with strong (naïve) independence assumptions between the features.</p>
                <p>Despite their simplicity and the often-unrealistic independence assumption, Naïve Bayes classifiers have worked quite well in many real-world situations, especially in document classification and spam filtering.</p>
            </Section>

            <Section title="Bayes' Theorem">
                <p>The algorithm is based on Bayes' theorem, which describes the probability of an event based on prior knowledge of conditions that might be related to the event. For classification, it's expressed as:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>P(A|B) = (P(B|A) * P(A)) / P(B)</code>
                <p>In classification terms, this becomes:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>P(class | features) = (P(features | class) * P(class)) / P(features)</code>
            </Section>

            <Section title="The 'Naïve' Assumption">
                <p>The "naïve" part is the assumption that all features are independent of each other, given the class. For spam filtering, this means assuming that the probability of the word "secret" appearing in an email is independent of the probability of the word "offer" appearing, which is often not true. However, this simplification makes the computation much more tractable, as we can calculate `P(features | class)` by simply multiplying the individual probabilities of each feature: `P(feature1 | class) * P(feature2 | class) * ...`</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default NaiveBayesArticle;
