import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Home() {
  const [posts, setPosts] = useState([])
  const [followingList, setFollowingList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch Posts
        const postsRes = await axios.get("https://linkup-144b.onrender.com/api/posts/seeposts", { withCredentials: true });
        setPosts(postsRes.data.postss || []);

        // Fetch Following List 
        const followRes = await axios.get("https://linkup-144b.onrender.com/api/followroute/seefollow", { withCredentials: true });
        
        // the users who are already in following list
        setFollowingList(followRes.data.followingIds || []);

      } catch (err) {
        console.error("Home Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleFollowToggle = async (targetUserId, targetUsername) => {
    setFollowLoading(targetUserId);
    try {
      const response = await axios.post('https://linkup-144b.onrender.com/api/followroute/follow', 
        { userId: targetUserId }, 
        { withCredentials: true }
      );
      
      // unfollow logic
      if (response.data.message.toLowerCase().includes("unfollowed")) {
        setFollowingList(prev => prev.filter(id => id !== targetUserId));
      } else {
        setFollowingList(prev => [...prev, targetUserId]);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setFollowLoading(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Feed...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 min-h-screen">
      <section className="space-y-6">
        {posts.map((post) => {
          // Check is this id in my follow or not
          const isFollowing = followingList.includes(post.username?._id);

          return (
            <div key={post._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">@{post.username?.username}</span>
                </div>

             
                <button 
                  type="button" 
                  onClick={() => handleFollowToggle(post.username?._id, post.username?.username)}
                  disabled={followLoading === post.username?._id}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                    isFollowing ? "bg-gray-200 text-gray-600" : "bg-blue-500 text-white"
                  }`}
                >
                  {followLoading === post.username?._id ? "..." : (isFollowing ? "Following" : "+ Follow")}
                </button>
                <div className='flex gap-3'>
                <button 
                className={`bg-white border shadow-sm rounded-full w-6 h-6items-center justify-center 
                text-[10px] hover:scale-125 transition-all duration-200 active:bg-red-50`}
                title="Like"
              >
                ❤️
              </button>

              <button 
                  className="bg-white border shadow-sm rounded-full w-7 h-7 flex items-center justify-center text-[12px] hover:scale-125 transition-transform"
                  title="Comment"
                >
                  💬
                </button>

                <button 
                  className="bg-white border border-gray-100 shadow-md rounded-full w-8 h-8 flex items-center justify-center text-[13px] hover:scale-125 transition-transform active:bg-gray-50"
                  title="Share"
                >
                  🚀
                </button>

              </div>
              </div>

              {post.mediaurl && <img src={post.mediaurl} className="w-full rounded-lg" alt="post" />}
              <p className="mt-2 text-sm">{post.caption}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Home;