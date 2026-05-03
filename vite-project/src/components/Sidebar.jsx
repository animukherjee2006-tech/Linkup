import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons ke liye lucide-react (recomended)

const Sidebar = ({ onLinkClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const menuItems = [
    { name: "Home", path: "/mainlayout/home", icon: "🏠" },
    { name: "Explore", path: "/mainlayout/search", icon: "🧭" },
    { name: "Messages", path: "chat", icon: "💬" },
    { name: "Profile", path: "/mainlayout/profile", icon: "👤" },
    { name: "Settings", path: "settings", icon: "⚙️" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavContent = () => (
    <>
      {/* Branding */}
      <div 
        className="flex items-center gap-3 mb-10 cursor-pointer group" 
        onClick={() => { navigate('/'); setIsOpen(false); }}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-lg group-hover:scale-105 transition-transform">
          <span className="text-2xl font-bold italic">L</span>
        </div>
        <span className="text-2xl font-bold text-indigo-600 tracking-tight">linkup</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => { if(onLinkClick) onLinkClick(); setIsOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                >
                  <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? "" : "grayscale group-hover:grayscale-0"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[16px]">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </>
  );

  return (
    <>
      {/* --- Mobile Header --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg">
            <span className="text-lg font-bold italic">L</span>
          </div>
          <span className="font-bold text-indigo-600">linkup</span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-gray-600">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={toggleMenu} />
      
      {/* --- Mobile Sidebar Drawer --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <NavContent />
      </aside>

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-gray-100 p-6 sticky top-0 overflow-y-auto">
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;