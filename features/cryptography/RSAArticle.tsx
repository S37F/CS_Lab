import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const RSAArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>RSA (Rivest–Shamir–Adleman) is one of the first public-key cryptosystems and is widely used for secure data transmission. In such a system, the encryption key is public and distinct from the decryption key which is kept secret (private). RSA is based on the presumed difficulty of factoring the product of two large prime numbers (the factoring problem).</p>
                <p>It is a fundamental component of many security protocols, including TLS/SSL (which secures websites), PGP for email encryption, and digital signatures.</p>
            </Section>

            <Section title="Key Generation">
                <p>The security of RSA relies on a public key and a private key. Here's how they are generated:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Choose two large prime numbers</strong>, p and q.</li>
                    <li><strong>Compute n = p * q</strong>. n is used as the modulus for both the public and private keys. Its length, usually expressed in bits, is the key length.</li>
                    <li><strong>Compute φ(n) (Euler's totient function)</strong>. φ(n) = (p-1) * (q-1).</li>
                    <li><strong>Choose an integer e</strong> such that 1 &lt; e &lt; φ(n) and e is coprime to φ(n) (i.e., gcd(e, φ(n)) = 1). e is released as the public key exponent.</li>
                    <li><strong>Determine d</strong> as the modular multiplicative inverse of e modulo φ(n). So, d * e ≡ 1 (mod φ(n)). d is kept as the private key exponent.</li>
                </ol>
                <p>The <strong>public key</strong> consists of (n, e) and the <strong>private key</strong> consists of (n, d).</p>
            </Section>

            <Section title="Encryption and Decryption">
                <p>The message must be represented as a number m where 0 ≤ m &lt; n.</p>
                <p><strong>Encryption:</strong> The ciphertext c is calculated as:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>{'c = m^e mod n'}</code>
                <p><strong>Decryption:</strong> The original message m can be recovered from the ciphertext c by:</p>
                <code className='block bg-background-elevated p-2 rounded-md my-2'>{'m = c^d mod n'}</code>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Let p = 3 and q = 11. Choose e = 7. Generate the public and private keys.</p>
                    <p><strong>2.</strong> Using the keys from the previous problem, encrypt the message m = 2.</p>
                    <p><strong>3.</strong> What makes RSA secure? Why is it computationally difficult to find the private key d just by knowing the public key (n, e)?</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default RSAArticle;