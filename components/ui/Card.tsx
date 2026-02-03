
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-background-secondary border border-border rounded-lg shadow-lg ${className}`}>
      {title && <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
