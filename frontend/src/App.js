import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Register from './components/Register';
import Login from './components/Login';
import JobApplication from './components/JobApplication';
import Companies from './components/Companies';
import About from './components/About';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply/:jobId" element={<JobApplication />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
