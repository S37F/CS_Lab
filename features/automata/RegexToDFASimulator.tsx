
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegexToDFASimulator: React.FC = () => {
  const [regex, setRegex] = useState('(a|b)*abb');
  const [showDFA, setShowDFA] = useState(false);

  const handleConvert = () => {
    // In a real implementation, this would trigger a complex conversion algorithm.
    // For now, we only support the hardcoded regex.
    if (regex === '(a|b)*abb') {
      setShowDFA(true);
    } else {
      setShowDFA(false);
      alert("Only the regex '(a|b)*abb' is supported in this simplified demonstration.");
    }
  };

  return (
     <div className="space-y-6">
      <Card title="Regex Input">
        <div className="flex space-x-2">
          <Input 
            value={regex} 
            onChange={(e) => setRegex(e.target.value)} 
            className="font-mono"
            placeholder="Enter a regular expression..."
          />
          <Button onClick={handleConvert}>Convert</Button>
        </div>
         <p className="text-xs text-text-tertiary mt-2">Note: This is a demonstration. Only the regex <strong>(a|b)*abb</strong> is supported to show the resulting DFA.</p>
      </Card>
      
      {showDFA && (
        <Card title="Resulting DFA">
            <div className="flex flex-col items-center justify-center h-full text-text-tertiary p-8">
                <h2 className="text-xl font-bold">DFA for (a|b)*abb</h2>
                <p>A full visual implementation is complex. The resulting DFA would have states representing:</p>
                <ul className="list-disc list-inside mt-4 text-left font-mono text-sm">
                    <li>q0 (start): has not seen 'a' yet or has seen 'b'</li>
                    <li>q1: has just seen 'a'</li>
                    <li>q2: has just seen 'ab'</li>
                    <li>q3 (accept): has just seen 'abb'</li>
                </ul>
            </div>
        </Card>
      )}
     </div>
  );
};

export default RegexToDFASimulator;
