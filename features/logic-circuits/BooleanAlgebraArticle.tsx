import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const BooleanAlgebraArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Introduction">
                <p>Boolean algebra is the branch of algebra in which the values of the variables are the truth values true (1) and false (0). It is used to analyze and simplify digital logic circuits. By simplifying a logic expression, we can reduce the number of logic gates required, which saves cost and power.</p>
            </Section>
            <Section title="Fundamental Laws">
                <ul className="list-none space-y-4">
                    <li><strong>Commutative Law:</strong> A + B = B + A; A · B = B · A</li>
                    <li><strong>Associative Law:</strong> (A + B) + C = A + (B + C); (A · B) · C = A · (B · C)</li>
                    <li><strong>Distributive Law:</strong> A · (B + C) = A · B + A · C</li>
                    <li><strong>Identity Law:</strong> A + 0 = A; A · 1 = A</li>
                    <li><strong>Annulment Law:</strong> A + 1 = 1; A · 0 = 0</li>
                    <li><strong>Inverse Law:</strong> A + A' = 1; A · A' = 0</li>
                    <li><strong>De Morgan's Laws:</strong> (A + B)' = A' · B'; (A · B)' = A' + B'</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BooleanAlgebraArticle;
