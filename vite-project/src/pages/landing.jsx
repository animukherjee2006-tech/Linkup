import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative px-5 pt-20 pb-28 md:pt-32 md:pb-36 text-center overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="absolute top-40 -left-32 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40 -z-10" />

          <div className="absolute top-20 -right-32 w-72 h-72 bg-sky-100 rounded-full blur-3xl opacity-40 -z-10" />

          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              A better way to connect
            </div>

            <div className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.02]">
              <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Connect with people
              </h1>

              <h1 className="text-gray-950">
                who truly matter.
              </h1>
            </div>

            <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-600">
              Share moments, discover communities, start conversations, and
              build meaningful connections with people from around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto min-w-[190px] bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Get Started
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto min-w-[190px] bg-white text-gray-900 border border-gray-300 px-8 py-4 rounded-xl text-lg font-bold hover:border-blue-400 hover:text-blue-600 hover:-translate-y-1 transition-all active:scale-95"
              >
                Explore Feed
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-14 text-sm text-gray-500">
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p>Connections</p>
              </div>

              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>

              <div>
                <p className="text-2xl font-bold text-gray-900">5K+</p>
                <p>Communities</p>
              </div>

              <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>

              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p>Conversations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">
                Everything you need
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-950">
                Connect. Share. Discover.
              </h2>

              <p className="mt-5 max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
                Linkup brings everything together to make online connections
                simpler and more meaningful.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative p-8 rounded-3xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-7 group-hover:bg-blue-600 transition-colors">
                  <span className="text-blue-600 font-bold text-lg group-hover:text-white transition-colors">
                    01
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-950 mb-3">
                  Build Your Network
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Find people you know, meet new friends, and grow your
                  network with meaningful connections.
                </p>

                <div className="mt-7 text-blue-600 font-semibold text-sm">
                  Grow your network →
                </div>
              </div>

              <div className="group relative p-8 rounded-3xl border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-7 group-hover:bg-indigo-600 transition-colors">
                  <span className="text-indigo-600 font-bold text-lg group-hover:text-white transition-colors">
                    02
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-950 mb-3">
                  Real-time Conversations
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Talk with your friends instantly through simple and
                  seamless real-time messaging.
                </p>

                <div className="mt-7 text-indigo-600 font-semibold text-sm">
                  Start chatting →
                </div>
              </div>

              <div className="group relative p-8 rounded-3xl border border-gray-200 bg-white hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-100/50 hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-7 group-hover:bg-sky-600 transition-colors">
                  <span className="text-sky-600 font-bold text-lg group-hover:text-white transition-colors">
                    03
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-950 mb-3">
                  Discover New People
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Explore communities, discover new interests, and meet
                  people who share your passions.
                </p>

                <div className="mt-7 text-sky-600 font-semibold text-sm">
                  Start discovering →
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="px-5 pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 px-7 py-16 md:px-16 md:py-20">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-40"></div>

              <div className="absolute -bottom-40 left-10 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">
                    Your community awaits
                  </p>

                  <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
                    Find your people.
                    <br />
                    <span className="text-blue-400">Find your place.</span>
                  </h2>

                  <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
                    Whether you're here to catch up with friends, meet new
                    people, or find a community that feels like home, Linkup
                    gives you a place to do it.
                  </p>

                  <button
                    onClick={() => navigate('/register')}
                    className="mt-8 px-7 py-3.5 bg-white text-gray-950 rounded-xl font-bold hover:bg-blue-50 hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Join Linkup
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <p className="text-3xl font-bold text-white">10K+</p>
                    <p className="mt-2 text-gray-400 text-sm">
                      Active connections
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <p className="text-3xl font-bold text-white">5K+</p>
                    <p className="mt-2 text-gray-400 text-sm">
                      Growing communities
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <p className="text-3xl font-bold text-white">24/7</p>
                    <p className="mt-2 text-gray-400 text-sm">
                      Conversations
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <p className="text-3xl font-bold text-white">∞</p>
                    <p className="mt-2 text-gray-400 text-sm">
                      New possibilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-blue-600 px-6 py-24 md:py-28 text-center overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white rounded-full blur-3xl opacity-10"></div>

          <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-indigo-900 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm">
              Start today
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Ready to connect?
            </h2>

            <p className="mt-6 text-blue-100 text-base md:text-xl leading-relaxed">
              Create your account and start building your network on Linkup.
            </p>

            <button
              onClick={() => navigate('/register')}
              className="mt-9 px-9 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:bg-gray-100 hover:-translate-y-1 transition-all active:scale-95"
            >
              Create Your Account
            </button>

            <p className="mt-5 text-sm text-blue-200">
              It only takes a minute to get started.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing