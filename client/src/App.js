import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Gratitude from './pages/GratitudePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gratitude" element={<Gratitude />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;