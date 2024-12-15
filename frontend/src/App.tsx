import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LateralMenu from './frontend/src/components/LateralMenu';
import SubmitPage from './pages/SubmitPage';
import ListPage from './pages/ListPage';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <LateralMenu />
        <main style={{ flex: 1, padding: '10px' }}>
          <Routes>
            <Route path="/" element={<SubmitPage />} />
            <Route path="/list" element={<ListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
