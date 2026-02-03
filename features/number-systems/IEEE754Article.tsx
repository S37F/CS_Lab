
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const IEEE754Article: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>IEEE 754 is a technical standard for floating-point arithmetic established in 1985 by the Institute of Electrical and Electronics Engineers (IEEE). It solved the problem of inconsistent floating-point representations across different computing platforms, enabling portability and reliability in numerical software.</p>
                <p>This standard is used in the floating-point unit (FPU) of virtually all modern CPUs and GPUs for scientific computing, graphics, and any calculation involving non-integer numbers.</p>
            </Section>

            <Section title="Structure of an IEEE-754 Number">
                <p>An IEEE 754 number is composed of three parts:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Sign Bit (1 bit):</strong> Determines if the number is positive (0) or negative (1).</li>
                    <li><strong>Exponent (8 bits for single-precision, 11 bits for double-precision):</strong> Represents the scale of the number. It is stored as a biased number to represent both large and small values.</li>
                    <li><strong>Mantissa or Significand (23 bits for single, 52 for double):</strong> Represents the precision of the number. It's a fractional binary number, typically normalized (with an implicit leading 1) to maximize precision.</li>
                </ul>
            </Section>
            
            <Section title="Single vs. Double Precision">
                 <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b border-border p-2 font-semibold">Format</th>
                            <th className="border-b border-border p-2 font-semibold">Total Bits</th>
                            <th className="border-b border-border p-2 font-semibold">Sign</th>
                            <th className="border-b border-border p-2 font-semibold">Exponent</th>
                             <th className="border-b border-border p-2 font-semibold">Mantissa</th>
                            <th className="border-b border-border p-2 font-semibold">Exponent Bias</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b border-border p-2">Single Precision (float)</td>
                            <td className="border-b border-border p-2">32</td>
                            <td className="border-b border-border p-2">1 bit</td>
                            <td className="border-b border-border p-2">8 bits</td>
                            <td className="border-b border-border p-2">23 bits</td>
                            <td className="border-b border-border p-2">127</td>
                        </tr>
                        <tr>
                            <td className="border-b border-border p-2">Double Precision (double)</td>
                            <td className="border-b border-border p-2">64</td>
                            <td className="border-b border-border p-2">1 bit</td>
                            <td className="border-b border-border p-2">11 bits</td>
                             <td className="border-b border-border p-2">52 bits</td>
                             <td className="border-b border-border p-2">1023</td>
                        </tr>
                    </tbody>
                </table>
            </Section>

            <Section title="Special Values">
                <p>The IEEE-754 standard also defines representations for special values:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Zero:</strong> Exponent and Mantissa are all zeros. The sign bit can be 0 or 1 (-0).</li>
                    <li><strong>Infinity:</strong> Exponent is all ones, Mantissa is all zeros. Can be +∞ or -∞.</li>
                    <li><strong>NaN (Not a Number):</strong> Exponent is all ones, Mantissa is non-zero. Represents results of invalid operations like 0/0.</li>
                    <li><strong>Denormalized Numbers:</strong> Exponent is all zeros, Mantissa is non-zero. Represent very small numbers close to zero.</li>
                </ul>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Convert the decimal number 9.125 to its 32-bit single-precision IEEE-754 representation.</p>
                    <p><strong>2.</strong> What decimal value does the 32-bit hex representation 0xC0490000 correspond to?</p>
                    <p><strong>3.</strong> Why is an exponent bias used instead of a system like two's complement for the exponent?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default IEEE754Article;
