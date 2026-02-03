
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const HammingCodeArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Goal">
                <p>Hamming code is a linear error-correcting code that can detect up to two-bit errors or correct one-bit errors. It is a significant improvement over simple parity bits, which can only detect single-bit errors. It achieves this by using multiple parity bits, each checking a different, overlapping subset of the data bits.</p>
            </Section>

            <Section title="Code Generation">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Determine Parity Bit Positions:</strong> Parity bits are placed at positions that are powers of 2 (1, 2, 4, 8, ...).</li>
                    <li><strong>Place Data Bits:</strong> The original data bits are filled into the remaining positions.</li>
                    <li><strong>Calculate Parity Bit Values:</strong> Each parity bit is calculated based on a unique set of data bits. For a parity bit at position 'p', it checks all bits at positions 'j' where the binary representation of 'j' has a 1 in the same place as 'p'. For example, P4 (position 100 in binary) checks bits 4, 5, 6, 7, 12, 13, 14, 15, etc. The value is set based on even or odd parity (typically even).</li>
                </ol>
            </Section>
            
            <Section title="Error Detection and Correction">
                 <ol className="list-decimal list-inside space-y-2">
                    <li>The receiver gets the (potentially erroneous) codeword.</li>
                    <li>The receiver recalculates each parity check using the received data and parity bits.</li>
                    <li>For each check, if the parity is incorrect, it indicates an error. The result of each check (0 for correct, 1 for incorrect) forms a binary number called the <strong>syndrome</strong>.</li>
                    <li>If the syndrome is 0, no error is detected. If it is non-zero, its decimal value points to the exact bit position that is in error. For example, a syndrome of 0101 (binary) means bit 5 is wrong.</li>
                    <li>The receiver can then flip the bit at the identified position to correct the error.</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default HammingCodeArticle;
