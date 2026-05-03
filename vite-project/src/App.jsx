import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Proctedroute from './components/Proctedroute';
import Mainlayout from './layout/Mainlayout';

// Pages
import Landing from './pages/landing';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Settings from './pages/Settings'; 
import CreatePost from './pages/Createpost';
import ChatPage from "./pages/ChatPage";
import OtherUserProfile from './pages/OtherUserProfile';



function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route element={<Proctedroute />}>
          <Route path="/mainlayout" element={<Mainlayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path='create-post' element={<CreatePost />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search" element={<Search />} />
            <Route path="settings" element={<Settings />} /> 
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path='otherprofile/:id' element={<OtherUserProfile/>}/>
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
