import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const LZWArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Applications">
                <p>Lempel–Ziv–Welch (LZW) is a universal lossless data compression algorithm created by Abraham Lempel, Jacob Ziv, and Terry Welch. It is a dictionary-based algorithm that works by finding repeated sequences of data and replacing them with a reference (a code) to a single copy of that sequence in a dictionary that is built during the compression process.</p>
                <p>LZW became very popular and was used in the GIF image format, as well as in the TIFF and PDF formats. It is efficient and relatively simple to implement.</p>
            </Section>

            <Section title="Algorithm Steps (Encoding)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Initialize a dictionary with all single-character strings and their corresponding codes (e.g., ASCII values).</li>
                    <li>Start with an empty working string `W`.</li>
                    <li>Read the next character `K` from the input stream.</li>
                    <li>Check if the string `W + K` is already in the dictionary.
                        <ul className="list-disc list-inside ml-4">
                           <li>If it is, update `W` to be `W + K` and repeat from step 3.</li>
                           <li>If it is not, then:
                                <ol className="list-decimal list-inside ml-8">
                                    <li>Emit the code for `W` to the output stream.</li>
                                    <li>Add the new string `W + K` to the dictionary with a new code.</li>
                                    <li>Update `W` to be just `K`.</li>
                                </ol>
                           </li>
                        </ul>
                    </li>
                    <li>Repeat from step 3 until the input stream is exhausted.</li>
                    <li>Once finished, emit the code for the final working string `W`.</li>
                </ol>
                 <p>The decoder can reconstruct the dictionary as it reads the codes, so only the code sequence needs to be sent.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default LZWArticle;