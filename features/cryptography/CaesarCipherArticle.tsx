
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

const CaesarCipherArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>The Caesar cipher is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and so on. The method is named after Julius Caesar, who used it in his private correspondence.</p>
                <p>While it offered some security in ancient times, it is easily broken with modern techniques (like frequency analysis) and is not used for secure communication today. It serves as a great introduction to the concepts of encryption, keys, and cryptanalysis.</p>
            </Section>

            <Section title="Mathematical Foundation">
                <p>The transformation can be represented using modular arithmetic. First, the letters are transformed into numbers (A=0, B=1, ..., Z=25). The encryption of a letter x by a shift n can be described mathematically as:</p>
                <CodeBlock>{`E_n(x) = (x + n) mod 26`}</CodeBlock>
                <p>Decryption is performed similarly:</p>
                <CodeBlock>{`D_n(x) = (x - n) mod 26`}</CodeBlock>
            </Section>

            <Section title="Step-by-Step Walkthrough">
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Choose a Key:</strong> Select a secret shift value (an integer from 1 to 25). This is your key.</li>
                    <li><strong>Take the Plaintext:</strong> Get the message you want to encrypt.</li>
                    <li><strong>Iterate and Shift:</strong> For each letter in the plaintext, find its corresponding letter in the alphabet that is 'n' positions away. For example, with a shift of 3, 'A' becomes 'D'.</li>
                    <li><strong>Handle Wraparound:</strong> If the shift goes past 'Z', it wraps around to the beginning of the alphabet. For instance, with a shift of 3, 'Y' becomes 'B'.</li>
                    <li><strong>Non-alphabetic Characters:</strong> Punctuation, spaces, and numbers are typically left unchanged.</li>
                    <li><strong>Result:</strong> The sequence of new letters forms the ciphertext.</li>
                </ol>
            </Section>

            <Section title="Limitations & Cryptanalysis">
                <p>The Caesar cipher is extremely insecure. Since there are only 25 possible keys (a shift of 0 is useless), an attacker can simply try every possible shift, an attack known as a brute-force attack.</p>
                <p>It is also vulnerable to frequency analysis. In any language, certain letters appear more frequently than others (e.g., 'E' in English). An attacker can analyze the frequency of letters in the ciphertext and make educated guesses about the shift value.</p>
            </Section>
            
            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Encrypt the message "HELLO WORLD" with a right shift of 5.</p>
                    <p><strong>2.</strong> Decrypt the ciphertext "CZGGJ RJMGAC" which was encrypted with a left shift of 2 (or a right shift of 24).</p>
                    <p><strong>3.</strong> The following ciphertext was encrypted with a Caesar cipher: "LUBTFE KVOBUFS". What is the original message? (Hint: Use frequency analysis or brute-force).</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default CaesarCipherArticle;
