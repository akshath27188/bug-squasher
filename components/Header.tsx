
import React from 'react';
import { BugIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/60 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-3">
          <BugIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Bug Squasher AI
          </h1>
        </div>
      </div>
    </header>
  );
};
