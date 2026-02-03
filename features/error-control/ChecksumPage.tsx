
import React from 'react';
import Tabs from '../../components/ui/Tabs';
import ChecksumArticle from './ChecksumArticle';
import ChecksumSimulator from './ChecksumSimulator';
import CodeDisplay from '../../components/ui/CodeDisplay';
import { checksumCode } from '../../data/code/error-control/checksumCode';

const ChecksumPage: React.FC = () => {
  const tabs = [
    { label: 'Educational Article', content: <ChecksumArticle /> },
    { label: 'Code Examples', content: <CodeDisplay codeSnippets={checksumCode} /> },
    { label: 'Interactive Calculator', content: <ChecksumSimulator /> },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Internet Checksum</h1>
        <p className="text-text-tertiary mt-1">An error-detection method based on one's complement arithmetic.</p>
      </header>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ChecksumPage;
