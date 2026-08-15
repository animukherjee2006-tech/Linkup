import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topnav from "../components/Topnav";

const Mainlayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px]
          bg-white border-r border-gray-100
          transform transition-transform duration-300 ease-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:flex-shrink-0
        `}
      >
        <div className="relative w-full h-full">
          <button
            onClick={closeSidebar}
            className="absolute right-4 top-4 z-10 w-9 h-9 rounded-xl
              bg-gray-100 text-gray-500
              flex items-center justify-center
              hover:bg-gray-200 hover:text-gray-800
              transition md:hidden"
          >
            <X size={19} />
          </button>

          <Sidebar onLinkClick={closeSidebar} />
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <header className="h-[68px] flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
          <div className="h-full flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="ml-4 w-10 h-10 rounded-xl
                bg-gray-50 text-gray-600
                flex items-center justify-center
                hover:bg-indigo-50 hover:text-indigo-600
                transition md:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="flex-1 min-w-0">
              <Topnav />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-7">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mainlayout;