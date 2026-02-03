
import React from 'react';
import Card from '../../components/ui/Card';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-background-elevated p-4 rounded-md my-4 overflow-x-auto">
    <code className="font-mono text-sm text-text-secondary">{children}</code>
  </pre>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const TwosComplementArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Two's complement is the most common method of representing signed integers (positive, negative, and zero) on computers. It's a binary number system that allows for standard binary arithmetic operations to be used for both positive and negative numbers, simplifying processor design.</p>
                <p>It is used in virtually every modern computing platform for integer arithmetic. The most significant bit (the leftmost bit) serves as the sign bit: 0 for positive numbers and 1 for negative numbers.</p>
            </Section>

            <Section title="Step-by-Step Walkthrough (for negative numbers)">
                <p>To find the two's complement representation of a negative decimal number in a fixed number of bits (e.g., 8 bits):</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Get the absolute value:</strong> Take the positive version of the number. For -5, use 5.</li>
                    <li><strong>Convert to binary:</strong> Convert the absolute value to binary. e.g., 5 becomes 101.</li>
                    <li><strong>Pad with zeros:</strong> Add leading zeros to fill the required bit width. For 8 bits, 101 becomes 00000101.</li>
                    <li><strong>Invert the bits (One's Complement):</strong> Flip all the bits (0s become 1s and 1s become 0s). 00000101 becomes 11111010.</li>
                    <li><strong>Add one:</strong> Add 1 to the result. 11111010 + 1 = 11111011.</li>
                </ol>
                <p>So, the 8-bit two's complement representation of -5 is 11111011.</p>
            </Section>

            <Section title="Number Range">
                <p>For a given number of bits 'n', the range of integers that can be represented using two's complement is:</p>
                <CodeBlock>{`[ -2^(n-1) ] to [ 2^(n-1) - 1 ]`}</CodeBlock>
                <p>For example, with 8 bits, the range is -128 to 127.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> What is the 8-bit two's complement representation of -42?</p>
                    <p><strong>2.</strong> What decimal value does the 8-bit two's complement binary number 10101010 represent?</p>
                    <p><strong>3.</strong> Why is two's complement preferred over sign-magnitude or one's complement for representing signed integers?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default TwosComplementArticle;
