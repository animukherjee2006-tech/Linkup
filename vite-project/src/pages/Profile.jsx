import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {

  const { id } = useParams()  
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch All Data on Mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Profile Info
        const profileRes = await axios.get('https://linkup-144b.onrender.com/api/userpost/seeprofile', { 
          withCredentials: true 
        });
        const profileUser = profileRes.data.userprofile;
        setUser(profileUser);

        // Fetch User posts
        const postsRes = await axios.get('https://linkup-144b.onrender.com/api/userpost/seeuserposts', { 
          withCredentials: true 
        });
        setUserPosts(postsRes.data.userposts);

        // Fetch Follow Stats & Status from your follow route
        const followRes = await axios.get('https://linkup-144b.onrender.com/api/followroute/seefollow', { 
          withCredentials: true 
        });
        
        setFollowersCount(followRes.data.followersCount || 0);
        setFollowingCount(followRes.data.followingCount || 0);
        
        // Check if we follow this user
        if (followRes.data.followingIds?.includes(profileUser._id)) {
          setIsFollowing(true);
        }

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('isLoggedIn');
          navigate('/login');
        }
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [navigate]);

// Handle Follow/Unfollow Toggle
  const handleFollowToggle = async () => {
    if (!user) return;
    setFollowLoading(true);

    try {
      const response = await axios.post('https://linkup-144b.onrender.com/api/followroute/follow', 
        { userId: user._id }, 
        { withCredentials: true }
      );
      
      const message = response.data.message.toLowerCase();
      
      if (message.includes("unfollowed")) {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1)); 
      } else {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-2xl shadow-md">
          {getInitials(user?.fullname || user?.username)}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-xl">{user?.fullname}</h2>
              <span className="text-sm text-gray-400">@{user?.username}</span>
            </div>

            
            <button 
              type="button" 
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                isFollowing 
                ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {followLoading ? "..." : (isFollowing ? "Following" : "+ Follow")}
            </button>
          </div>

          
          <div className="flex gap-6 mt-4 text-sm font-medium text-gray-600">
            <div className="flex flex-col items-center sm:flex-row sm:gap-1">
              <span className="text-gray-900 font-bold">{userPosts.length}</span>
              <span className="text-gray-400 font-normal">Posts</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:gap-1">
              <span className="text-gray-900 font-bold">{followersCount}</span>
              <span className="text-gray-400 font-normal">Followers</span>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:gap-1">
              <span className="text-gray-900 font-bold">{followingCount}</span>
              <span className="text-gray-400 font-normal">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Posts */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Gallery</h3>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {userPosts.map((post) => (
              <div key={post._id} className="group relative aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                {post.mediatype !== 'text' ? (
                  <img 
                    src={post.mediaurl} 
                    alt="User content" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center text-xs text-center italic bg-indigo-50 text-indigo-900">
                    {post.caption?.substring(0, 50)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No memories shared yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

 