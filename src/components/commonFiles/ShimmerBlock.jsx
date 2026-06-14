import React from 'react';

const ShimmerBlock = ({ className = '', style }) => (
  <div className={`relative overflow-hidden bg-background rounded-md ${className}`} style={style}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

export default ShimmerBlock;
