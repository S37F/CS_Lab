import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const CFGArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition">
                <p>A Context-Free Grammar (CFG) is a formal grammar in which every production rule is of the form V → w, where V is a single non-terminal symbol, and w is a string of terminals and/or non-terminals. The "context-free" part means that the non-terminal V can always be replaced by w, regardless of the context in which it appears.</p>
                <p>CFGs are powerful enough to describe the syntax of most programming languages.</p>
            </Section>

            <Section title="Formal Definition (The 4-Tuple)">
                <p>A CFG is formally defined as a 4-tuple (N, T, P, S):</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>N (or V):</strong> A finite set of non-terminal symbols (variables).</li>
                    <li><strong>T (or Σ):</strong> A finite set of terminal symbols, disjoint from N. These are the alphabet of the language.</li>
                    <li><strong>P:</strong> A finite set of production rules. Each rule maps a non-terminal to a string of terminals and non-terminals.</li>
                    <li><strong>S:</strong> A designated start symbol from N.</li>
                </ul>
            </Section>

            <Section title="Derivations and Parse Trees">
                <p>A string is said to be in the language of a CFG if it can be generated starting from the start symbol 'S' by repeatedly applying the production rules. This sequence of rule applications is called a <strong>derivation</strong>.</p>
                <p>A <strong>parse tree</strong> is a graphical representation of a derivation. The root of the tree is the start symbol, the leaves are the terminal symbols, and the interior nodes are non-terminals. Parse trees are used by compilers to check if source code is syntactically correct.</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default CFGArticle;
