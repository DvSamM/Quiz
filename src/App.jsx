import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import necessary routing components
import { navItems } from './nav-items';
import './index.css'
const App = () => {
  return (
    <Router>
      {/* A simple navigation bar */}
      <nav>
        <ul>
          {navItems.map((item, index) => (
            <div key={index}>
              <Link to={item.to}>
                {item.icon}
                {item.title}
              </Link>
            </div>
          ))}
        </ul>
      </nav>

      {/* Define routes */}
      <Routes>
        {navItems.map((item, index) => (
          <Route key={index} path={item.to} element={item.page} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
