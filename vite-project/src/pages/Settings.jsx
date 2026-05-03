import React, { useState } from 'react';
import Axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

function Settings() {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    setLoading(true);
    setError("");

    try {
      const res = await Axios.post("https://linkup-144b.onrender.com/api/auth/logoutuser");

      
      localStorage.removeItem('isLoggedIn');
      
      alert(res.data.message || "Logged out successfully");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Logout Failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: isHovered ? '#ffe6e6' : 'white',
    borderRadius: '15px',
    padding: '15px 20px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: '0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    opacity: loading ? 0.7 : 1
  };

  const iconStyle = {
    fontSize: '20px',
    color: 'red',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
    padding: '5px 10px',
    borderRadius: '8px'
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!loading ? handleLogout : null} 
    >
      <div style={iconStyle}>
        {loading ? "..." : "[ →"}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: 'red', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
          {loading ? "Logging out..." : "Log Out"}
        </h3>
        <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>
          {error ? <span style={{color: 'orange'}}>{error}</span> : "Sign out from your account"}
        </p>
      </div>
    </div>
  );
}

export default Settings;