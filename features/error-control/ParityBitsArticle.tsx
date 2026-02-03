
import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const ParityBitsArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>A parity bit, or check bit, is a single bit added to a binary string to ensure that the total number of 1-bits in the string is either even or odd. It is one of the simplest forms of error detection codes.</p>
                <p>Historically, it was widely used in early computer systems and for data transmission over noisy channels, such as in modems and serial ports (e.g., RS-232). While more robust methods like CRC are common today, parity is still used in some low-level applications due to its simplicity and low overhead.</p>
            </Section>

            <Section title="Types of Parity">
                <p>There are two types of parity:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Even Parity:</strong> The parity bit is set to 1 if the number of ones in the data is odd, making the total number of ones (including the parity bit) an even number. If the number of ones is already even, the parity bit is 0.</li>
                    <li><strong>Odd Parity:</strong> The parity bit is set to 1 if the number of ones in the data is even, making the total number of ones an odd number. If the number of ones is already odd, the parity bit is 0.</li>
                </ul>
            </Section>
            
            <Section title="How It Works">
                <ol className="list-decimal list-inside space-y-2">
                   <li>The sender and receiver agree on the type of parity to use (even or odd).</li>
                   <li>The sender calculates the parity bit for the data to be sent and appends it to the data.</li>
                   <li>The data, along with the parity bit, is transmitted.</li>
                   <li>The receiver gets the data and recalculates the parity bit based on the received data bits.</li>
                   <li>The receiver compares its calculated parity bit with the received parity bit. If they match, the data is assumed to be error-free. If they don't match, an error is detected.</li>
                </ol>
            </Section>
            
            <Section title="Limitations">
                <p>The main weakness of a parity bit is that it can only reliably detect an odd number of bit errors (e.g., 1, 3, 5 bits flipped). If an even number of bits are flipped during transmission (e.g., 2 bits), the parity check will still pass, and the error will go undetected. It also provides no mechanism for error correction; it can only signal that an error occurred.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> What is the even parity bit for the data 1011010?</p>
                    <p><strong>2.</strong> The data 1101001 with an odd parity bit is received as 11011011. Will the error be detected? Why or why not?</p>
                    <p><strong>3.</strong> Why can't a single parity bit detect a 2-bit error?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default ParityBitsArticle;
