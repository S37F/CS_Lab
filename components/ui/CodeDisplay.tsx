import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from '../Icons';
import Button from './Button';

interface CodeDisplayProps {
  codeSnippets: { [language: string]: string };
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ codeSnippets }) => {
  const languages = Object.keys(codeSnippets);
  const [selectedLang, setSelectedLang] = useState(languages[0] || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-background-secondary border border-border rounded-lg">
      <div className="flex justify-between items-center px-4 border-b border-border">
        <div className="flex-grow">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`${
                  selectedLang === lang
                    ? 'border-accent-primary text-accent-primary font-semibold'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {lang}
              </button>
            ))}
          </nav>
        </div>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="flex items-center"
        >
          {isCopied ? <CheckIcon className="w-4 h-4 mr-2 text-accent-success" /> : <CopyIcon className="w-4 h-4 mr-2" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <div className="relative p-4">
        <pre className="bg-background-elevated p-4 rounded-md overflow-x-auto text-sm">
          <code className={`language-${selectedLang.toLowerCase()} text-text-secondary font-mono`}>
            {codeSnippets[selectedLang]}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;