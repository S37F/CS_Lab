import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const LogicGateArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Introduction to Logic Gates">
                <p>A logic gate is an idealized or physical device implementing a Boolean function, a logical operation performed on one or more binary inputs that produces a single binary output. They are the basic building blocks of any digital system.</p>
            </Section>
            <Section title="Basic Logic Gates">
                <ul className="list-none space-y-4">
                    <li><strong>AND Gate:</strong> The output is 'true' (1) if and only if all inputs are 'true'.</li>
                    <li><strong>OR Gate:</strong> The output is 'true' if at least one of the inputs is 'true'.</li>
                    <li><strong>NOT Gate (Inverter):</strong> The output is the opposite of the input.</li>
                    <li><strong>XOR Gate (Exclusive OR):</strong> The output is 'true' if the inputs are different.</li>
                    <li><strong>NAND Gate (NOT-AND):</strong> The output is 'false' if and only if all inputs are 'true'. It is the inverse of an AND gate.</li>
                    <li><strong>NOR Gate (NOT-OR):</strong> The output is 'true' if and only if all inputs are 'false'. It is the inverse of an OR gate.</li>
                </ul>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default LogicGateArticle;
