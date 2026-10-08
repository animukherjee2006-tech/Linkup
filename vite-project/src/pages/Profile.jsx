import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Settings,
  Grid3X3,
  Image as ImageIcon,
  Loader2,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State for viewing posts full screen
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

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

  // Modal Navigation Handlers
  const handleNextPost = useCallback(() => {
    if (selectedPostIndex !== null && selectedPostIndex < userPosts.length - 1) {
      setSelectedPostIndex(selectedPostIndex + 1);
    }
  }, [selectedPostIndex, userPosts.length]);

  const handlePrevPost = useCallback(() => {
    if (selectedPostIndex !== null && selectedPostIndex > 0) {
      setSelectedPostIndex(selectedPostIndex - 1);
    }
  }, [selectedPostIndex]);

  const handleCloseModal = () => {
    setSelectedPostIndex(null);
  };

  // Keyboard controls for modal navigation (Arrow keys + Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPostIndex === null) return;

      if (e.key === "ArrowRight") {
        handleNextPost();
      } else if (e.key === "ArrowLeft") {
        handlePrevPost();
      } else if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPostIndex, handleNextPost, handlePrevPost]);

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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={36} className="text-blue-600 animate-spin" />
          <p className="text-sm text-blue-900/60 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white border border-blue-100 shadow-sm flex items-center justify-center">
            <User size={32} className="text-blue-400" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">Profile unavailable</h2>

          <p className="text-sm text-slate-500 mt-2">
            We couldn't load your profile right now.
          </p>
        </div>
      </div>
    );
  }

  const activePost = selectedPostIndex !== null ? userPosts[selectedPostIndex] : null;

  return (
    <div className="min-h-screen bg-blue-50/40 text-slate-800 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Instagram Profile Header */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-blue-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-16 pb-10">
          {/* Avatar with Blue Gradient Ring */}
          <div className="relative group">
            <div className="p-1 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 shadow-md">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white overflow-hidden bg-blue-50 flex items-center justify-center font-bold text-3xl sm:text-4xl text-blue-600">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user.fullname || user.username)
                )}
              </div>
            </div>
          </div>

          {/* Profile Metadata */}
          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide">
                {user.username}
              </h1>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => navigate("/settings")}
                  className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold text-sm rounded-xl transition"
                >
                  Edit profile
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl transition"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-12 py-3 border-y sm:border-y-0 border-blue-100 my-4 sm:my-0 text-sm">
              <div>
                <span className="font-bold text-slate-900">{userPosts.length}</span>{" "}
                <span className="text-slate-500">posts</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{followersCount}</span>{" "}
                <span className="text-slate-500">followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{followingCount}</span>{" "}
                <span className="text-slate-500">following</span>
              </div>
            </div>

            {/* Bio Details */}
            <div className="mt-4 text-sm">
              <h2 className="font-bold text-slate-900">
                {user.fullname || user.username}
              </h2>
              {user.bio && (
                <p className="mt-1 text-slate-600 whitespace-pre-line leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-12 border-b border-blue-100 mt-8 text-xs font-bold tracking-widest uppercase text-slate-400">
          <div className="flex items-center gap-2 py-4 border-b-2 border-blue-600 text-blue-600 cursor-pointer">
            <Grid3X3 size={15} />
            <span>Posts</span>
          </div>
        </div>

        {/* Posts Grid Layout */}
        <main className="mt-6">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {userPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  onClick={() => setSelectedPostIndex(index)}
                  className="group relative aspect-square bg-white rounded-2xl shadow-sm border border-blue-100 cursor-pointer overflow-hidden"
                >
                  {post.mediatype !== "text" && post.mediaurl ? (
                    <img
                      src={post.mediaurl}
                      alt={post.caption || "Post media"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full p-4 flex items-center justify-center text-center bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-900">
                      <p className="text-xs sm:text-sm font-medium line-clamp-4">
                        {post.caption || "Text Post"}
                      </p>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm sm:text-base backdrop-blur-[2px]">
                    <div className="flex items-center gap-2">
                      <Heart size={20} className="fill-white" />
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} className="fill-white" />
                      <span>{post.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-blue-100 py-20 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <ImageIcon size={30} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Posts Yet</h3>
            </div>
          )}
        </main>
      </div>

      {/* Post Detail Modal */}
      {selectedPostIndex !== null && activePost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
          {/* Close Modal Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-blue-200 p-2 z-50"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Navigation Previous */}
          {selectedPostIndex > 0 && (
            <button
              onClick={handlePrevPost}
              className="absolute left-2 sm:left-6 text-blue-600 bg-white/90 hover:bg-white p-2 rounded-full z-50 shadow-md transition"
              aria-label="Previous Post"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Navigation Next */}
          {selectedPostIndex < userPosts.length - 1 && (
            <button
              onClick={handleNextPost}
              className="absolute right-2 sm:right-6 text-blue-600 bg-white/90 hover:bg-white p-2 rounded-full z-50 shadow-md transition"
              aria-label="Next Post"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Modal Container */}
          <div
            className="bg-white border border-blue-100 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Media */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[60vh] md:max-h-[85vh]">
              {activePost.mediatype !== "text" && activePost.mediaurl ? (
                <img
                  src={activePost.mediaurl}
                  alt={activePost.caption || "Selected post"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center max-w-md bg-gradient-to-tr from-blue-600 to-indigo-700 w-full h-full flex items-center justify-center">
                  <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                    "{activePost.caption}"
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Profile, Caption, Comments & Engagement */}
            <div className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-blue-100 flex flex-col justify-between bg-white">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-blue-100">
                <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.fullname || user.username)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {user.username}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {user.fullname || ""}
                  </p>
                </div>
              </div>

              {/* Caption & Body scrollable area */}
              <div className="p-4 flex-1 overflow-y-auto text-sm space-y-4">
                {activePost.caption && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user.fullname || user.username)
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 mr-2">
                        {user.username}
                      </span>
                      <span className="text-slate-600 leading-relaxed">
                        {activePost.caption}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Comments */}
              <div className="border-t border-blue-100 p-4 space-y-3 bg-blue-50/30">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-blue-600 transition">
                      <Heart size={24} />
                    </button>
                    <button className="hover:text-blue-600 transition">
                      <MessageCircle size={24} />
                    </button>
                    <button className="hover:text-blue-600 transition">
                      <Share2 size={24} />
                    </button>
                  </div>
                  <button className="hover:text-blue-600 transition">
                    <Bookmark size={24} />
                  </button>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  {activePost.likesCount || 0} likes
                </div>

                {/* Comment Input */}
                <div className="pt-2 border-t border-blue-100 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-transparent text-sm text-slate-800 focus:outline-none flex-1 placeholder:text-slate-400"
                  />
                  <button className="text-blue-600 font-bold text-sm hover:text-blue-700 transition">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;