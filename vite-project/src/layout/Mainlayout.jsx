import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';

const Mainlayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* 2. Sidebar (Mobile Drawer + Desktop Fixed) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out bg-white 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:flex`}
      >
        <Sidebar onLinkClick={closeSidebar} />
      </aside>

      {/* 3. Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header with Search and Mobile Toggle */}
        <header className="flex items-center bg-white border-b border-gray-100 sticky top-0 z-30">
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="ml-4 p-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg"
          >
            <span className="text-2xl">☰</span>
          </button>
          
          <div className="flex-1">
            <Topnav />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Mainlayout;