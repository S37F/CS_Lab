
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

const BaseConversionArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Base conversion is the process of converting a number from one numeral system (base) to another. The base of a number system is the number of unique digits, including zero, used to represent numbers. For example, the decimal system (base-10) uses digits 0-9, while binary (base-2) uses 0 and 1.</p>
                <p>Base conversion is fundamental in computer science for understanding data representation. Computers operate in binary (base-2), but humans often interact with them using decimal (base-10) or hexadecimal (base-16) for tasks like memory addressing, color representation (e.g., #FFFFFF), and low-level programming.</p>
            </Section>

            <Section title="Conversion Methods">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Converting from Any Base to Decimal (Base-10)</h3>
                <p>To convert a number from any base 'b' to decimal, you multiply each digit by the base raised to the power of its position (starting from 0 on the right). Then, sum up the results.</p>
                <p>Example: Convert 1101₂ to decimal.</p>
                <CodeBlock>{`(1 * 2³) + (1 * 2²) + (0 * 2¹) + (1 * 2⁰)
= (1 * 8) + (1 * 4) + (0 * 2) + (1 * 1)
= 8 + 4 + 0 + 1 = 13₁₀`}</CodeBlock>

                <h3 className="text-xl font-semibold text-text-primary mt-6 mb-2">Converting from Decimal (Base-10) to Any Base</h3>
                <p>To convert a decimal number to another base 'b', you use the method of repeated division (for the integer part) and repeated multiplication (for the fractional part).</p>
                <p><strong>Integer Part:</strong> Repeatedly divide the decimal number by the target base. The remainders, read in reverse order of their calculation, form the new number.</p>
                <p>Example: Convert 13₁₀ to binary (base-2).</p>
                <CodeBlock>{`13 / 2 = 6 remainder 1
6 / 2 = 3 remainder 0
3 / 2 = 1 remainder 1
1 / 2 = 0 remainder 1

Reading remainders from bottom to top: 1101₂`}</CodeBlock>
            </Section>

            <Section title="Common Bases in Computing">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Binary (Base-2):</strong> The fundamental language of computers. Uses digits 0 and 1.</li>
                    <li><strong>Octal (Base-8):</strong> Uses digits 0-7. Sometimes used in computing, as it's easy to convert to/from binary (3 binary digits = 1 octal digit).</li>
                    <li><strong>Decimal (Base-10):</strong> The standard system for human counting. Uses digits 0-9.</li>
                    <li><strong>Hexadecimal (Base-16):</strong> Uses digits 0-9 and letters A-F. Widely used because it compactly represents binary numbers (4 binary digits = 1 hex digit).</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Convert the number 255₁₀ to both binary and hexadecimal.</p>
                    <p><strong>2.</strong> Convert the hexadecimal number 1A3F₁₆ to decimal.</p>
                    <p><strong>3.</strong> Convert the binary number 10110.01₂ to decimal.</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default BaseConversionArticle;
