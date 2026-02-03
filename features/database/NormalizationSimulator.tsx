
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { analyzeNormalization } from '../../services/normalizationService';

const NormalizationSimulator: React.FC = () => {
    const [attributes, setAttributes] = useState('StudentID, StudentName, CourseID, CourseName, InstructorID, InstructorName');
    const [primaryKey, setPrimaryKey] = useState('StudentID, CourseID');
    const [fds, setFds] = useState('StudentID -> StudentName\nCourseID -> CourseName\nInstructorID -> InstructorName\nCourseID -> InstructorID');
    const [analysis, setAnalysis] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleAnalyze = () => {
        try {
            setError('');
            const attrList = attributes.split(',').map(s => s.trim()).filter(Boolean);
            const pkList = primaryKey.split(',').map(s => s.trim()).filter(Boolean);
            const result = analyzeNormalization(attrList, pkList, fds);
            setAnalysis(result.analysis);
            if(result.error) setError(result.error);
        } catch (e) {
            setError('Failed to parse input. Please check the format.');
            setAnalysis([]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Card title="Schema Definition">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Attributes (comma-separated)</label>
                            <Input value={attributes} onChange={e => setAttributes(e.target.value)} placeholder="attr1, attr2, attr3"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Primary Key (comma-separated)</label>
                            <Input value={primaryKey} onChange={e => setPrimaryKey(e.target.value)} placeholder="attr1, attr2"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-secondary mb-1 block">Functional Dependencies (one per line)</label>
                            <textarea
                                value={fds}
                                onChange={e => setFds(e.target.value)}
                                className="w-full h-24 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                                placeholder="attr1, attr2 -> attr3"
                            />
                        </div>
                        <Button onClick={handleAnalyze} className="w-full">Analyze Normal Form</Button>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Analysis Result">
                    <div className="h-[400px] overflow-y-auto bg-background-elevated p-4 rounded-md">
                        {analysis.length > 0 ? (
                            <div className="space-y-3 text-sm text-text-secondary">
                                {analysis.map((line, i) => {
                                    if(line.startsWith('Highest Normal Form:')) {
                                        return <p key={i} className="text-lg font-bold text-accent-primary">{line}</p>
                                    }
                                    if(line.includes('Violation')) {
                                        return <p key={i} className="text-accent-warning">{line}</p>
                                    }
                                    return <p key={i} dangerouslySetInnerHTML={{__html: line}} />
                                })}
                            </div>
                        ) : (
                            <p className="text-text-tertiary">Analysis will appear here.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default NormalizationSimulator;
