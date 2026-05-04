import React, { useState } from 'react'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'
import logregphoto from '../assets/logreghomepage.png'
import Logolight from '../assets/logo-light.png'
function Register() {

  const [isBlack,setBlack]=useState(false)
  const navigate=useNavigate()
  const [formdata,setformdata]=useState({
    username:'',
    firstname:'',
    lastname:'',
    phone:'',
    email:'',
    password:''
  })

  const [loading,setloading]=useState(false)
  const [error,seterror]=useState(" ")

  const handlechange= (e) =>{
    setformdata({
      ...formdata,[e.target.name]:e.target.value
    })
  }

  //function for handle the api.

const handleSubmit = async (e) => {
  e.preventDefault();
  setloading(true);
  seterror("");

  try {
    const res = await Axios.post("https://linkup-144b.onrender.com/api/auth/register", formdata, {
      withCredentials: true 
    });

    // Grab the token from the response
    const token = res.data.token;

    if (token) {
      // Save both the flag and the actual token
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      alert("You are successfully registered");
      navigate('/mainlayout');
    } else {
      // Fallback if your backend only registers without logging in
      alert("Registration successful! Please log in.");
      navigate('/login');
    }
  } catch (err) {
    seterror(err.response?.data?.message || "Registration Failed");
  } finally {
    setloading(false);
  }
};
  return (
    <>
    
<div className={`flex items-center justify-center min-h-screen transition duration-300 ${
  isBlack ? "bg-black" : "bg-gray-100"
}`}>


        <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden md:flex-row m-4">

         
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
  <div className="inline-flex items-center gap-2 bg-transparent shadow-none p-0 border-none">
  <div 
    onClick={() => navigate('/')}
    className="w-10 h-10 flex items-center justify-center bg-[#00008B] text-white text-[25px] font-bold rounded-[10px] cursor-pointer"
  >
    L
  </div>
  <div className="text-[25px] font-bold text-black">Linkup</div>
</div>
        <h1 className='text-center'>Register</h1>

         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
         <form onSubmit={handleSubmit}>

          <input name="username"placeholder='Username' 
          onChange={handlechange}
          className="w-full border p-2 mb-2 rounded"/>

          <div>
            <input name="firstname"placeholder='firstname' 
          onChange={handlechange}
          className="w-1/2 border p-2 mb-2 rounded"/>

          <input name="lastname"placeholder='lastname' 
          onChange={handlechange}
          className="w-1/2 border p-2 mb-2 rounded"/>
          </div>

        
          <input name='phone' placeholder='Phone number'
          onChange={handlechange}
          className='w-full border p-2 mb-2 rounded'
          />

          <input name="email" placeholder='email' className='w-full border p-2 mb-2 rounded 'onChange={handlechange} />
          <input name="password" placeholder='password' className='w-full border p-2 mb-2 rounded'onChange={handlechange} />
          <input name="confirm password" placeholder='confirm password' className='w-full border p-2 mb-2 rounded'onChange={handlechange} />

           <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
  >
    Submit
  </button>
  <h1 style={{cursor:'pointer'}}onClick={() => navigate('/login')}>Already have a account</h1>
         </form>

        </div>
      <div className="md:w-1/2">
      
        <img 
          src={logregphoto} 
          alt="photo" 
          className="w-full h-full  object-cover"
        />
      </div>
      </div>
    </div>
    </>
  )
}

export default Register