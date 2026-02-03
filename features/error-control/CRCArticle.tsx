
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

const CRCArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Cyclic Redundancy Check (CRC) is a robust error-detecting code commonly used in digital networks and storage devices to detect accidental changes to raw data. It is highly effective at detecting common errors caused by noise in transmission channels.</p>
                <p>CRC is used in Ethernet, Wi-Fi, PCI Express, SATA, and many other communication and storage standards. The specific implementation is defined by its generator polynomial.</p>
            </Section>

            <Section title="Mathematical Foundation">
                <p>CRC is based on binary division (or more formally, division of polynomials over the finite field GF(2)). The data bits are treated as the coefficients of a polynomial, M(x), and are divided by a fixed, pre-defined generator polynomial, G(x). The remainder of this division is the CRC checksum.</p>
                <p>The key operation in this division is the exclusive OR (XOR), as there are no borrows or carries.</p>
            </Section>
            
            <Section title="CRC Calculation (Sender Side)">
                <ol className="list-decimal list-inside space-y-2">
                   <li><strong>Choose a Generator Polynomial (G):</strong> A generator of degree 'r' is chosen. This determines the length of the CRC code (r bits). e.g., for CRC-4, a common generator is x⁴ + x + 1, or 10011 in binary.</li>
                   <li><strong>Append Zeros:</strong> Append 'r' zero bits to the end of the original data message (M). This gives the dividend.</li>
                   <li><strong>Binary Division:</strong> Divide the augmented data by the generator polynomial using binary long division (XOR).</li>
                   <li><strong>Get Remainder:</strong> The 'r'-bit remainder from this division is the CRC checksum.</li>
                   <li><strong>Transmit:</strong> The original data message is transmitted along with the CRC checksum appended to it. This forms the codeword.</li>
                </ol>
            </Section>
            
             <Section title="CRC Verification (Receiver Side)">
                <ol className="list-decimal list-inside space-y-2">
                   <li>The receiver gets the codeword (original data + CRC).</li>
                   <li>The receiver divides the entire codeword by the same generator polynomial (G).</li>
                   <li>If the remainder is zero, the data is considered error-free. If the remainder is non-zero, an error has occurred.</li>
                </ol>
             </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Given data M = 110101 and generator G = 1011, calculate the CRC checksum.</p>
                    <p><strong>2.</strong> Why is CRC more effective at detecting burst errors (multiple consecutive bit errors) than a simple checksum?</p>
                    <p><strong>3.</strong> The received codeword is 10110011 and the generator is 1001. Has an error occurred?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default CRCArticle;
