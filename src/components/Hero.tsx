import { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Chatbot } from './ChatBot';
import { LoadingSpinner } from './Loading';

import { Jobs } from '../utils/mockJobs';

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');



  return (
    <div className="h-screen bg-gradient-to-b from-indigo-50 via-indigo-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center pt-20">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your First Career Step
            <br />
            <span className="text-indigo-600">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Find entry-level positions that truly welcome beginners. No experience required,
            no deceptive listings—just honest opportunities to start your career.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 max-w-xl bg-white rounded-lg shadow-md p-2 flex items-center"
            >
              <Search className="h-5 w-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search for jobs..."
                className="w-full px-4 py-2 focus:outline-none"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1,000+</div>
              <div className="text-gray-600">Entry-level positions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Trusted companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support available</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};