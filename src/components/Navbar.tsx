import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Menu, X, User, Bell, Mail } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <nav className="absolute top-0 left-0 w-full h-20 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Briefcase className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">EntryPoint</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Jobs
          </Link>
          {/* <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
            Contact
          </Link> */}
          <div className="flex items-center space-x-7">
            {loggedIn ? (
              <>
                <Link to="/notifications" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </Link>
                <Link to="/account" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  Sign up
                </Link>
              </>
            )}
            <Link
              to="/employer"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 absolute top-20 w-full z-40">
          <div className="flex flex-col space-y-4">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center space-x-4">
              {loggedIn ? (
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                    Log in
                  </Link>
                  <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
              <Link
                to="/employer"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};