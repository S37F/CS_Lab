import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const SignedMagnitudeArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition">
                <p>Signed Magnitude is a method for encoding signed numbers where the most significant bit (MSB) is designated as the 'sign bit', and the remaining bits represent the absolute value or 'magnitude' of the number.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>A <strong>sign bit of 0</strong> indicates a positive number.</li>
                    <li>A <strong>sign bit of 1</strong> indicates a negative number.</li>
                </ul>
                <p>For example, in an 8-bit system, +42 would be <strong>0</strong>0101010, and -42 would be <strong>1</strong>0101010.</p>
            </Section>

            <Section title="Limitations">
                <p>While simple to understand, the signed magnitude representation has significant drawbacks that have led to it being largely replaced by two's complement in modern computers:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Two Representations of Zero:</strong> There is a positive zero (e.g., 00000000) and a negative zero (e.g., 10000000). This ambiguity complicates hardware design and can lead to errors if not handled carefully.</li>
                    <li><strong>Complicated Arithmetic:</strong> Standard binary addition and subtraction circuits do not work correctly. The hardware must check the sign bits and then perform either addition or subtraction depending on the signs and magnitudes, which is inefficient.</li>
                </ul>
            </Section>

            <Section title="Number Range">
                 <p>For a given number of bits 'n', the range of integers that can be represented is:</p>
                 <code className='block bg-background-elevated p-2 rounded-md my-2'>{`[ -(2^(n-1) - 1) ] to [ 2^(n-1) - 1 ]`}</code>
                <p>For example, with 8 bits, the range is -127 to +127.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default SignedMagnitudeArticle;