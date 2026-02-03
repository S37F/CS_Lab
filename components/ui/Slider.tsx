
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, className, ...props }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {label && <label className="text-sm font-medium text-text-secondary w-20">{label}</label>}
      <input
        type="range"
        value={value}
        className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-accent-primary"
        {...props}
      />
    </div>
  );
};

export default Slider;
