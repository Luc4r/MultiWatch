import React from 'react';

const MoveIcon = () => 
  <svg viewBox="0 0 32 32" style={{ transform: 'rotate(45deg)' }}>
    <polyline points="20 6 26 6 26 12" />
    <polyline points="12 26 6 26 6 20" />
    <line x1="9" x2="23" y1="23" y2="9" />
    <polyline points="6 12 6 6 12 6" />
    <polyline points="26 20 26 26 20 26" />
    <line x1="23" x2="9" y1="23" y2="9" />
  </svg>

export default MoveIcon;