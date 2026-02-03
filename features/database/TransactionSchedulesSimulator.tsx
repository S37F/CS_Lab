import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { analyzeScheduleProperties } from '../../services/transactionScheduleService';

const TransactionSchedulesSimulator: React.FC = () => {
    const [scheduleInput, setScheduleInput] = useState('W1(A); R2(A); C1; A2');
    const [result, setResult] = useState<{ recoverable: boolean, cascadeless: boolean, violations: string[] } | null>(null);

    const handleAnalyze = () => {
        const analysisResult = analyzeScheduleProperties(scheduleInput);
        setResult(analysisResult);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Transaction Schedule">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Schedule (use R, W, C for Commit, A for Abort)</label>
                            <textarea
                                value={scheduleInput}
                                onChange={e => setScheduleInput(e.target.value)}
                                className="w-full h-24 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                                placeholder="e.g., W1(X); R2(X); C1; C2"
                            />
                        </div>
                        <Button onClick={handleAnalyze} className="w-full">Analyze Schedule Properties</Button>
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Analysis Result">
                    {result && (
                        <div className="space-y-4">
                             <div className={`p-4 rounded-md text-center ${result.recoverable ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                                <h3 className="font-bold text-lg">
                                    Recoverable: {result.recoverable ? "Yes" : "No"}
                                </h3>
                            </div>
                            <div className={`p-4 rounded-md text-center ${result.cascadeless ? 'bg-accent-success/20 text-accent-success' : 'bg-red-500/20 text-red-500'}`}>
                                <h3 className="font-bold text-lg">
                                    Cascadeless: {result.cascadeless ? "Yes" : "No"}
                                </h3>
                            </div>
                             <div className="border-t border-border mt-4 p-4 h-[150px] overflow-y-auto">
                                <h4 className="font-semibold text-text-primary mb-2">Analysis Details:</h4>
                                {result.violations.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm font-mono text-text-secondary">
                                        {result.violations.map((v, i) => <li key={i}>{v}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-text-tertiary">No violations found.</p>}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TransactionSchedulesSimulator;
