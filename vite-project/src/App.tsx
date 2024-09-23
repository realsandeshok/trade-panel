// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from './components/ui/tooltip'; // Import your TooltipProvider
import { Auth } from './components/component/auth'; // Adjust the path as necessary
import { Accounts } from './components/component/accounts';
import { Scripts } from './components/component/scripts';
import { Test } from './components/component/test';
import { Trade } from './components/component/trade';
import { Analytics } from './components/component/analytics';

export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          {/* <Route path="/dashboard" element={<Auth />} /> */}
          <Route path="/" element={<Auth />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/portfolio" element={<Test />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </TooltipProvider>
  );
}
