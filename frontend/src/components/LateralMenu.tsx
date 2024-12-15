import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { Link } from 'react-router-dom';

const LateralMenu: React.FC = () => {
  return (
    <div style={{ width: '400px', height: '100vh', background: '#f0f0f0', padding: '20px' }}>
      <div>
        <ConnectButton />
      </div>
      <h1>Public Project Test 1</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/">Submit Page</Link></li>
        <li><Link to="/list">List Page</Link></li>
      </ul>
    </div>
  );
};

export default LateralMenu;
