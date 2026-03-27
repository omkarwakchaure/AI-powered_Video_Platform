import logo from '../../assets/logo.svg';
import logoFull from '../../assets/logo-full.svg';
import React from 'react';

function Logo({ size = 'md', variant = 'full' }) {
  const sizes = {
    xs: 'h-4',
    sm: 'h-7',
    md: 'h-8',
    lg: 'h-20',
  };

  const src = variant === 'full' ? logoFull : logo;

  return <img src={src} alt="MediaMixer" className={`${sizes[size]} object-contain`} />;
}

export default Logo;
