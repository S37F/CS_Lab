import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const RegexToDFAArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Introduction">
                <p>Regular Expressions and Finite Automata are two ways of describing regular languages. A key result in automata theory is that for every regular expression, there exists a finite automaton that accepts the same language, and vice-versa. The process of converting a regex to a DFA is fundamental to how regex matching is implemented in many text processing tools.</p>
                <p>The conversion is typically a two-step process: first, the regex is converted to a Nondeterministic Finite Automaton (NFA), and then the NFA is converted to an equivalent DFA.</p>
            </Section>

            <Section title="Step 1: Regex to NFA (Thompson's Construction)">
                <p>Thompson's construction is a classic algorithm to convert a regex to an NFA. It works recursively by building NFAs for the basic components of the regex and then combining them.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Base Cases:</strong> A single symbol 'a' becomes a simple two-state NFA. The empty string ε has its own simple NFA.</li>
                    <li><strong>Concatenation (ab):</strong> The NFA for 'a' is connected to the NFA for 'b' via an ε-transition.</li>
                    <li><strong>Union (a|b):</strong> A new start state is created with ε-transitions to the start states of the NFAs for 'a' and 'b'. A new accept state is created with ε-transitions from the accept states of 'a' and 'b'.</li>
                    <li><strong>Kleene Star (a*):</strong> The NFA for 'a' is wrapped with new start and accept states and ε-transitions to allow for zero or more repetitions.</li>
                </ul>
            </Section>

            <Section title="Step 2: NFA to DFA (Subset Construction)">
                <p>The subset construction algorithm converts an NFA to a DFA. The core idea is that each state in the DFA corresponds to a *set* of states in the NFA.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Start with the ε-closure of the NFA's start state. This set of NFA states becomes the start state of the DFA.</li>
                    <li>Create a queue and add the new DFA start state to it.</li>
                    <li>While the queue is not empty:</li>
                    <ul className="list-disc list-inside ml-4">
                        <li>Dequeue a DFA state (which is a set of NFA states).</li>
                        <li>For each symbol in the alphabet, determine the set of states the NFA could transition to from the current set. This new set becomes a new DFA state.</li>
                        <li>If this new DFA state hasn't been seen before, add it to the queue.</li>
                        <li>Record the transition in the DFA's transition table.</li>
                    </ul>
                     <li>A DFA state is an accept state if it contains at least one of the NFA's original accept states.</li>
                </ol>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default RegexToDFAArticle;
