import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrowseJobs } from './pages/BrowseJobs';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PostJob } from './pages/PostJob';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/employer" element={<PostJob />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;