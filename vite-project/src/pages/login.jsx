import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({ username: '', password: '' });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");

    try {
      const res = await Axios.post("https://linkup-144b.onrender.com/api/auth/loginuser", formdata, {
        withCredentials: true // MANDATORY: This lets the browser store the cookie
      });

      // Instead of storing the token, store a flag for the UI
      localStorage.setItem('isLoggedIn', 'true');
      alert(res.data.message);
      navigate('/mainlayout');
    } catch (err) {
      seterror(err.response?.data?.message || "Login Failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto m-50 ">

      <div style={{justifyContent:'space-between',display:'flex'}}>
          <div className="inline-flex items-center gap-2 bg-transparent shadow-none p-0 border-none">
  <div 
    onClick={() => navigate('/')}
    className="w-10 h-10 flex items-center justify-center bg-[#00008B] text-white text-[25px] font-bold rounded-[10px] cursor-pointer"
  >
    L
  </div>
  <div className="text-[25px] font-bold text-black">Linkup</div>
</div>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handlesubmit} className="space-y-4">
        <input name="username" placeholder='Username' className='w-full border p-2 rounded' onChange={handlechange}/>
        <input name='password' type="password" placeholder='Password' className='w-full border p-2 rounded' onChange={handlechange} />
        <button type='submit' className="bg-blue-500 text-white w-full py-2 rounded">Submit</button>
      </form>
    </div>
  );
}

export default Login;