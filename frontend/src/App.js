import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Life from './pages/Life';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the homepage */}
          <Route path="/text-to-wrapped" element={<Homepage />} />

          {/* Route for checking server status */}
          <Route path="/life" element={<Life />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
