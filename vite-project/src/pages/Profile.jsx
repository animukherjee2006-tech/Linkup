import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Settings,
  Grid3X3,
  Image as ImageIcon,
  Loader2,
  User,
} from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const [profileRes, postsRes, followRes] = await Promise.all([
          axios.get(
            "https://linkup-144b.onrender.com/api/userpost/seeprofile",
            config
          ),
          axios.get(
            "https://linkup-144b.onrender.com/api/userpost/seeuserposts",
            config
          ),
          axios.get(
            "https://linkup-144b.onrender.com/api/followroute/seefollow",
            config
          ),
        ]);

        setUser(profileRes.data.userprofile);
        setUserPosts(postsRes.data.userposts || []);
        setFollowersCount(followRes.data.followersCount || 0);
        setFollowingCount(followRes.data.followingCount || 0);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={36}
            className="text-indigo-600 animate-spin"
          />
          <p className="text-sm text-gray-500 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-sm flex items-center justify-center">
            <User size={32} className="text-gray-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Profile unavailable
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            We couldn't load your profile right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-7">
        <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-32 sm:h-44 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_30%)]" />

            <button
              onClick={() => navigate("/settings")}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition"
            >
              <Settings size={19} />
            </button>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            <div className="-mt-12 sm:-mt-14">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[30px] bg-gradient-to-br from-indigo-500 to-violet-600 border-[5px] border-white shadow-xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl">
                {getInitials(user.fullname || user.username)}
              </div>
            </div>

            <div className="mt-5">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {user.fullname || user.username}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                @{user.username}
              </p>

              {user.bio && (
                <p className="text-sm text-gray-600 mt-4 max-w-xl leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            <div className="flex items-center gap-8 sm:gap-12 mt-7">
              <div>
                <p className="text-xl font-black text-gray-900">
                  {userPosts.length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Posts
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-gray-900">
                  {followersCount}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Followers
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-gray-900">
                  {followingCount}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Following
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between px-1 mb-4">
            <div className="flex items-center gap-2">
              <Grid3X3
                size={17}
                className="text-indigo-600"
              />

              <h2 className="font-bold text-gray-900">
                Your Posts
              </h2>
            </div>

            <span className="text-xs text-gray-400">
              {userPosts.length} shared
            </span>
          </div>

          {userPosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                >
                  {post.mediatype !== "text" && post.mediaurl ? (
                    <>
                      <img
                        src={post.mediaurl}
                        alt={post.caption || "Your post"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {post.caption && (
                        <p className="absolute left-4 right-4 bottom-4 text-white text-xs font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {post.caption}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full p-5 flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50">
                      <div>
                        <div className="w-11 h-11 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                          <ImageIcon
                            size={19}
                            className="text-indigo-500"
                          />
                        </div>

                        <p className="text-xs sm:text-sm font-medium text-indigo-900 leading-relaxed line-clamp-6">
                          {post.caption || "Your shared thought"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center">
                <ImageIcon
                  size={27}
                  className="text-indigo-500"
                />
              </div>

              <h3 className="font-bold text-gray-800 mt-5">
                No posts yet
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Your shared posts will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;

 