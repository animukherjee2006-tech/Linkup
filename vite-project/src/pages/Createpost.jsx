import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!file && !caption.trim()) {
      alert("Please add at least a caption or an image.")
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) {
      formData.append('file', file);
    }

    try {
     const token = localStorage.getItem('token');

     const response = await axios.post(
  "https://linkup-144b.onrender.com/api/posts/makepost",
  formData,
  {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  }
);

      if (response.status === 201 || response.status === 200) {
        alert("Success: Post Created!")
        navigate('/mainlayout/home')
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea 
          placeholder="What's on your mind?"
          className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Posting to Linkup..." : "Share Post"}
        </button>
      </form>
    </div>
  )
}

export default CreatePost