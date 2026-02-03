import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { simulateDfa } from '../../services/dfaService';
import type { DFA } from '../../types';

const defaultDfa: DFA = {
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
        'q0': { '0': 'q1', '1': 'q0' },
        'q1': { '0': 'q1', '1': 'q2' },
        'q2': { '0': 'q1', '1': 'q0' },
    },
    startState: 'q0',
    acceptStates: ['q2']
};

const DFAGraph: React.FC<{ dfa: DFA, currentState: string | null }> = ({ dfa, currentState }) => {
    // A simple graph layout
    const positions: { [key: string]: { x: number, y: number } } = {
        'q0': { x: 50, y: 100 },
        'q1': { x: 150, y: 100 },
        'q2': { x: 250, y: 100 },
    };

    return (
        <svg width="100%" height="200" viewBox="0 0 300 200">
            {/* Edges */}
            {Object.entries(dfa.transitions).map(([fromState, trans]) => 
                Object.entries(trans).map(([symbol, toState]) => {
                    const fromPos = positions[fromState];
                    const toPos = positions[toState];
                    const isSelfLoop = fromState === toState;
                    if (!fromPos || !toPos) return null;
                    return (
                        <g key={`${fromState}-${symbol}`}>
                            {isSelfLoop ? (
                                <path d={`M ${fromPos.x} ${fromPos.y-20} a 15 15 0 1 1 0.1 0 Z`} stroke="#9ca3af" strokeWidth="1" fill="none" />
                            ) : (
                                <path d={`M ${fromPos.x} ${fromPos.y} Q ${(fromPos.x+toPos.x)/2} ${fromPos.y - 40} ${toPos.x} ${toPos.y}`} stroke="#9ca3af" strokeWidth="1" fill="none" />
                            )}
                            <text x={isSelfLoop ? fromPos.x : (fromPos.x+toPos.x)/2} y={isSelfLoop ? fromPos.y-40 : fromPos.y-45} fontSize="10" textAnchor="middle" fill="#d1d5db">{symbol}</text>
                        </g>
                    );
                })
            )}
            {/* States */}
            {dfa.states.map(state => {
                const pos = positions[state];
                const isAccept = dfa.acceptStates.includes(state);
                const isCurrent = state === currentState;
                if (!pos) return null;
                return (
                    <g key={state}>
                        <circle cx={pos.x} cy={pos.y} r="20" fill={isCurrent ? '#3b82f6' : '#1a1a1a'} stroke="#9ca3af" strokeWidth="2" />
                        {isAccept && <circle cx={pos.x} cy={pos.y} r="15" fill="none" stroke="#9ca3af" strokeWidth="2" />}
                        <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#ffffff" fontSize="12">{state}</text>
                        {dfa.startState === state && <path d={`M ${pos.x - 40} ${pos.y} L ${pos.x - 20} ${pos.y}`} stroke="#9ca3af" strokeWidth="2" />}
                    </g>
                );
            })}
        </svg>
    );
};


const DFAAcceptanceSimulator: React.FC = () => {
    const [dfa] = useState<DFA>(defaultDfa);
    const [inputString, setInputString] = useState('01101');
    const [result, setResult] = useState<{ accepted: boolean; steps: { state: string, input: string }[] } | null>(null);

    const handleSimulate = () => {
        const simulationResult = simulateDfa(dfa, inputString);
        setResult(simulationResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                 <Card title="DFA Definition (Language: ends with '01')">
                    <div className="font-mono text-sm space-y-2">
                        <p><strong>States:</strong> {`{${dfa.states.join(', ')}}`}</p>
                        <p><strong>Alphabet:</strong> {`{${dfa.alphabet.join(', ')}}`}</p>
                        <p><strong>Start State:</strong> {dfa.startState}</p>
                        <p><strong>Accept States:</strong> {`{${dfa.acceptStates.join(', ')}}`}</p>
                    </div>
                </Card>
                <Card title="Input String" className="mt-6">
                    <div className="space-y-4">
                        <Input value={inputString} onChange={e => setInputString(e.target.value.replace(/[^01]/g, ''))} className="font-mono text-lg"/>
                        <Button onClick={handleSimulate} className="w-full">Run Simulation</Button>
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Simulation Trace">
                    <DFAGraph dfa={dfa} currentState={result?.steps.slice(-1)[0]?.state ?? dfa.startState} />
                    {result && (
                         <div className={`mt-4 p-4 rounded-md text-center ${result.accepted ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                            <h3 className="font-bold text-lg">
                                String "{inputString}" is {result.accepted ? 'Accepted' : 'Rejected'}
                            </h3>
                        </div>
                    )}
                    <div className="mt-4 p-2 h-32 overflow-y-auto bg-background-elevated rounded-md font-mono text-sm">
                        {result?.steps.map((step, i) => (
                           <p key={i}>Current State: <strong>{step.state}</strong>, Remaining Input: "{step.input}"</p>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DFAAcceptanceSimulator;
