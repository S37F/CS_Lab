import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const DFAAcceptanceArticle: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <Card className="bg-background-secondary">
        <div className="p-4">
            <Section title="Definition & Applications">
                <p>A Deterministic Finite Automaton (DFA) — also known as a deterministic finite state machine — is a model of computation that accepts or rejects strings of symbols. For any given input string, a DFA produces a unique computation or run.</p>
                <p>DFAs are used in a wide variety of applications, including lexical analysis in compilers, network protocol analysis, text parsing, and regular expression matching.</p>
            </Section>

            <Section title="Formal Definition (The 5-Tuple)">
                <p>A DFA is formally defined as a 5-tuple (Q, Σ, δ, q₀, F):</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Q:</strong> A finite set of states.</li>
                    <li><strong>Σ (Sigma):</strong> A finite set of input symbols called the alphabet.</li>
                    <li><strong>δ (Delta):</strong> The transition function, where δ: Q × Σ → Q. It takes a state and an input symbol as arguments and returns a single state.</li>
                    <li><strong>q₀:</strong> The initial or start state, an element of Q.</li>
                    <li><strong>F:</strong> A set of accept states or final states, a subset of Q.</li>
                </ul>
            </Section>

            <Section title="How a DFA Processes a String">
                <p>A DFA processes an input string one symbol at a time, starting from the start state.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>The machine starts in the initial state, q₀.</li>
                    <li>For each symbol in the input string, it uses the transition function δ to move from its current state to the next state.</li>
                    <li>After the last symbol of the string has been processed, the computation stops.</li>
                    <li>If the DFA is in a state that is part of the set of accept states (F), the string is <strong>accepted</strong>. Otherwise, the string is <strong>rejected</strong>.</li>
                </ol>
                <p>A key characteristic of a DFA is that for every state and every symbol in the alphabet, there is exactly one transition to a next state. It is "deterministic".</p>
            </Section>
        </div>
      </Card>
    </div>
  );
};

export default DFAAcceptanceArticle;
