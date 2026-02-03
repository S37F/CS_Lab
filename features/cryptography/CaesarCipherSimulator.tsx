import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Slider from '../../components/ui/Slider';

const CaesarCipherSimulator: React.FC = () => {
  const [plaintext, setPlaintext] = useState<string>('CSLab is Awesome');
  const [shift, setShift] = useState<number>(3);
  const [ciphertext, setCiphertext] = useState<string>('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const inputText = mode === 'encrypt' ? plaintext : ciphertext;
    let outputText = '';
    const effectiveShift = mode === 'encrypt' ? shift : -shift;

    for (let i = 0; i < inputText.length; i++) {
      let char = inputText[i];
      let transformedChar = char;

      if (/[a-zA-Z]/.test(char)) {
        const isUpperCase = char === char.toUpperCase();
        const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        const originalCharCode = char.charCodeAt(0);
        
        let shiftedCode = originalCharCode - base + effectiveShift;
        shiftedCode = (shiftedCode % 26 + 26) % 26;
        
        transformedChar = String.fromCharCode(base + shiftedCode);
      }
      outputText += transformedChar;
    }

    if (mode === 'encrypt') {
        setCiphertext(outputText);
    } else {
        setPlaintext(outputText);
    }
  }, [plaintext, ciphertext, shift, mode]);

  const handleModeToggle = () => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card title={mode === 'encrypt' ? "Plaintext Input" : "Plaintext Output"}>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            readOnly={mode === 'decrypt'}
            className="w-full h-32 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
            placeholder="Enter text to encrypt..."
          />
        </Card>
        <Card title="Controls">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button onClick={handleModeToggle} variant="secondary">
                Switch to {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'} Mode
              </Button>
            </div>
            <Slider
              label={`Shift: ${shift}`}
              min="1"
              max="25"
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
            />
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card title={mode === 'decrypt' ? "Ciphertext Input" : "Ciphertext Output"}>
            <textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                readOnly={mode === 'encrypt'}
                className="w-full h-32 p-2 bg-background-elevated border border-border rounded-md font-mono text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                placeholder="Enter text to decrypt..."
            />
        </Card>
        <Card title="Alphabet Mapping">
            <div className="font-mono text-sm text-center overflow-x-auto p-2">
                <div className="flex justify-between text-text-tertiary">
                    {alphabet.map(char => <span key={char} className="w-6">{char}</span>)}
                </div>
                 <div className="flex justify-center text-accent-primary text-lg">↓</div>
                 <div className="flex justify-between font-bold">
                    {alphabet.map((_, i) => {
                        const shiftedIndex = (i + shift) % 26;
                        return <span key={i} className="w-6">{alphabet[shiftedIndex]}</span>
                    })}
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default CaesarCipherSimulator;