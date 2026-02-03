
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const ChecksumArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>A checksum is an error-detection code used to detect errors in data that has been transmitted or stored. The Internet Checksum, as defined in RFC 1071, is a specific implementation used in standard internet protocols like IP, TCP, and UDP to verify the integrity of packet headers.</p>
                <p>It works by summing up the data in fixed-size chunks (e.g., 16-bit words) and then taking the one's complement of the final sum. This result is the checksum value.</p>
            </Section>

            <Section title="Checksum Calculation (Sender Side)">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Divide Data:</strong> The data is divided into k-bit chunks (typically 16-bit words).</li>
                    <li><strong>Summation:</strong> All the k-bit chunks are added together using one's complement arithmetic.</li>
                    <li><strong>Handle Carry:</strong> If the summation results in a carry-out from the most significant bit, this carry bit is added back to the least significant bit of the sum. This is called an "end-around carry". This step is repeated until no more carries are produced.</li>
                    <li><strong>One's Complement:</strong> The final sum is inverted (all bits are flipped) to produce the checksum. This checksum value is then transmitted along with the original data.</li>
                </ol>
            </Section>
            
            <Section title="Checksum Verification (Receiver Side)">
                 <ol className="list-decimal list-inside space-y-2">
                    <li>The receiver takes all the received data chunks, including the checksum, and adds them together using the same one's complement arithmetic (including the end-around carry).</li>
                    <li>The final sum is then inverted (one's complement).</li>
                    <li>If the result is zero, the data is considered to be free of errors. If the result is non-zero, an error is detected. A key property is that the sum of all data words plus the checksum should be a word of all 1s (-0 in one's complement), which becomes all 0s after the final inversion.</li>
                </ol>
            </Section>
            
            <Section title="Limitations">
                <p>While more robust than a simple parity check, the Internet Checksum is not foolproof. It can fail to detect certain errors, such as the reordering of data chunks, insertion or deletion of zero-valued chunks, or multiple errors that cancel each other out. For more critical applications, stronger methods like CRC are preferred.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Calculate the 16-bit Internet Checksum for the two hex words: 0x1234 and 0x5678.</p>
                    <p><strong>2.</strong> Why is the checksum value the one's complement of the sum, rather than just the sum itself?</p>
                    <p><strong>3.</strong> If a 16-bit data word changes from 0xABCD to 0xABCE during transmission, how does the checksum verification fail?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default ChecksumArticle;
