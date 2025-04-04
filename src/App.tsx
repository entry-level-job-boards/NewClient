import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrowseJobs } from './pages/BrowseJobs';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PostJob } from './pages/PostJob';

import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

import { Chatbot } from './components/ChatBot';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';

import { LogoutSuccess } from './components/logout-success';
import { SkillSelection } from './components/SkillSelection';

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

          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          <Route path="/account" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/logout-success" element={<LogoutSuccess />} />
          <Route path="/skills" element={<SkillSelection />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;