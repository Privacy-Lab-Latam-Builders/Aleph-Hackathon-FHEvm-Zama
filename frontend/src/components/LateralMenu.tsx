import React from 'react';
import { Link } from 'react-router-dom';

const LateralMenu: React.FC = () => {
  return (
    <div style={{ width: '200px', height: '100vh', background: '#f0f0f0', padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/">Submit Page</Link></li>
        <li><Link to="/list">List Page</Link></li>
      </ul>
    </div>
  );
};

export default LateralMenu;
