import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
