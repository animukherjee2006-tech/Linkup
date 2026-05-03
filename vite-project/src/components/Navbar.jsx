import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md w-full">
      <div className="flex items-center gap-2">
        <div style={{width:'40px',height:'40px',color:'white',fontSize:'30px',textAlign:'center',backgroundColor:'darkblue'
          ,borderRadius:'10px',fontWeight:'bold',cursor:'pointer'
        }} onClick={()=> navigate('/')}>L</div>
        <div style={{fontSize:'25px',fontWeight:'bold'}}>Linkup</div>
      </div>

      <div style={{cursor:'pointe',justifyContent:'center',alignItems:'center',gap:'10px',display:'flex'}}>
        <Link to="/login" style={{backgroundColor:'black', color:'white', width:'60px', height:'30px',textAlign:'center',
          borderRadius:'5px',fontWeight:'bold'
        }}>Login</Link>
        <Link to="/register" style={{backgroundColor:'black',color:'white',width:'60px',height:'30px', textAlign:'center',
        borderRadius:'5px',fontWeight:'bold'

        }}>Sign up</Link>
      </div>
    </nav>
  )
}

export default Navbar;

