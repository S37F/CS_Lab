import React from 'react';
import Card from '../../components/ui/Card';

const ID3Simulator: React.FC = () => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center h-64 text-text-tertiary p-8">
          <h2 className="text-2xl font-bold mb-2">Simulator Coming Soon</h2>
          <p>The interactive simulator for ID3 Decision Tree is currently under development.</p>
      </div>
    </Card>
  );
};

export default ID3Simulator;
