import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  padding = 'normal',
  hover = true,
  onClick 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-5',
    large: 'p-6',
  };

  return (
    <div 
      className={`
        glass-card 
        ${paddingClasses[padding]} 
        ${hover ? 'hover:transform' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
