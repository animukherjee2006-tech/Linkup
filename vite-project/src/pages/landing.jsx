import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center px-5">
        
        <div className="mt-20 md:mt-32">
          <div className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-tight">
            <h1 className="text-blue-600">Connect with people</h1>
            <h1 className="text-black">who matter</h1>
          </div>
        </div>

        <h3 className="mt-8 text-lg md:text-xl font-bold max-w-2xl text-gray-800">
          Join millions of users sharing moments, building communities,
          and discovering new connections on linkup
        </h3>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 w-full sm:w-auto">
          <button 
            className="bg-blue-600 text-white px-10 py-4 rounded-md text-xl font-bold cursor-pointer hover:bg-blue-700 transition-all active:scale-95"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>

          <button 
            className="bg-white text-black border-2 border-black px-10 py-4 rounded-md text-xl font-bold cursor-pointer hover:bg-gray-100 transition-all active:scale-95"
            onClick={() => navigate('/login')}
          >
            Explore Feed
          </button>
        </div>
        
      </div>

     <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-10 mt-12 ">
  
  <div className="w-full max-w-xs h-64 flex flex-col items-center justify-center text-center p-6 
              border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-bold text-lg mb-2 text-blue-600">Build Your Network</h3>
    <p className="text-gray-600 text-sm">
      Connect with friends, family, and professionals from around the world.
    </p>
  </div>

  <div className="w-full max-w-xs h-64 flex flex-col items-center justify-center text-center p-6 
              bg-white border border-gray-100 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
    <h3 className="font-bold text-lg mb-2 text-indigo-600">Real-time Conversations</h3>
    <p className="text-gray-600 text-sm">
      Chat instantly with anyone, anywhere with our seamless messaging platform.
    </p>
  </div>

</div>

<div className="flex flex-col items-center justify-center gap-6 bg-blue-600 py-16 px-6 text-center min-h-[40vh]">
  <h1 className="text-3xl md:text-5xl font-extrabold text-white">
    Ready to get started?
  </h1>

  <p className="text-blue-100 text-lg md:text-xl max-w-lg">
    Join Linkup today and start connecting with the world
  </p>

  <button 
    onClick={() => navigate('/register')}
    className="w-full max-w-[240px] py-4 bg-white text-blue-600 font-bold text-lg rounded-xl 
               shadow-md hover:bg-gray-100 transition-all active:scale-95"
  >
    Create Your Account
  </button>
</div>
     </div>
  )
}

export default Landing