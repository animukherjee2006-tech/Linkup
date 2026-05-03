import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md h-16 flex items-center px-8">
      <div className="relative flex-1 max-w-xl mx-auto">
         {/* Search bar... */}
      </div>

      <div className="flex items-center gap-3 ml-4">
        <button 
          onClick={() => navigate('/mainlayout/create-post')} // Navigate here
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          <span className="text-xl">＋</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;