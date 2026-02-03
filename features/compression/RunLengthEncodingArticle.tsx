
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

const RunLengthEncodingArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Real-World Applications">
                <p>Run-Length Encoding (RLE) is a very simple form of lossless data compression in which runs of data (that is, sequences in which the same data value occurs in many consecutive data elements) are stored as a single data value and count, rather than as the original run.</p>
                <p>This is most useful on data that contains many such runs. For example, simple graphic images such as icons, line drawings, and animations. It is not useful with files that don't have many runs as it could potentially increase the file size.</p>
                 <p>Example: The string "WWWWWBWWBB" would be encoded as "5W1B2W2B".</p>
            </Section>

            <Section title="Step-by-Step Walkthrough (Encoding)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start at the beginning of the data stream.</li>
                    <li>Read the first character and count how many times it repeats consecutively. This is the 'run'.</li>
                    <li>Write the count of the character, followed by the character itself, to the output stream.</li>
                    <li>Move the pointer in the input stream to the character immediately following the run.</li>
                    <li>Repeat from step 2 until the end of the input stream is reached.</li>
                </ol>
            </Section>
            
            <Section title="Limitations">
                <p>RLE's effectiveness is highly dependent on the content of the data. If the data has very few runs of repeating characters, RLE can actually increase the size of the data. For example, encoding the string "ABCDEFG" would result in "1A1B1C1D1E1F1G", which is twice the original size.</p>
                <p>For this reason, it is often used as one component within a larger compression scheme, or on specific types of data where it is known to be effective, like bitmap images.</p>
            </Section>

            <Section title="Practice Problems">
                <div className="space-y-3">
                    <p><strong>1.</strong> Encode the following string using RLE: "AAAAAAAAAAAAABCCCCDDEEEEE".</p>
                    <p><strong>2.</strong> Decode the following RLE string: "4A2B6C1A".</p>
                    <p><strong>3.</strong> Describe a type of file or data where RLE would be a very poor compression choice, and explain why.</p>
                </div>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default RunLengthEncodingArticle;
