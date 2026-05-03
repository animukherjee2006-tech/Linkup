import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setResults([]); 
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://linkup-144b.onrender.com/api/posts/searchposts?query=${searchTerm}`, {
        withCredentials: true
      });
      setResults(res.data.posts);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
  
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 text-xl">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search username, captions, or #hashtags..."
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        <span className="text-indigo-600 font-bold text-2xl">{searchTerm ? '🔎' : '📈'}</span>
        {searchTerm ? `Results for "${searchTerm}"` : 'Trending Posts'}
      </div>

      {loading && <p className="text-indigo-600 animate-pulse">Searching Linkup...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length > 0 ? (
          results.map((post) => (
            <div 
              key={post._id} 
              className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group relative border border-gray-100"
            >
              {/* Media Preview */}
              {post.mediatype !== 'text' ? (
                <img src={post.mediaurl} className="w-full h-full object-cover" alt="post" />
              ) : (
                <div className="p-6 flex items-center justify-center h-full text-center text-sm font-medium text-gray-700 italic">
                  "{post.caption.substring(0, 60)}..."
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-xs font-bold">@{post.username?.username}</p>
                <p className="text-white text-[10px] line-clamp-2 mt-1">{post.caption}</p>
              </div>

<button 
  onClick={() => {
   
    
    if (post.username && post.username._id) {
      navigate(`/mainlayout/otherprofile/${post.username._id}`)
    } else {
      console.error("User ID missing in post data");
    }
  }} 
  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors text-[10px]"
>
  View Profile
</button>
            </div>
          ))
        ) : (
          !loading && searchTerm && <p className="text-gray-400 col-span-full text-center">No posts found matching that search.</p>
        )}
      </div>
    </div>
  );
};

export default Search;