

import React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full bg-background-elevated border border-border rounded-md shadow-sm py-2 px-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors duration-200 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
