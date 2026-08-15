import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formdata, setformdata] = useState({
    username: '',
    password: ''
  })

  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    })
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')

    try {
      const res = await Axios.post(
        'https://linkup-144b.onrender.com/api/auth/loginuser',
        formdata,
        {
          withCredentials: true
        }
      )

      const token = res.data.token

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', 'true')

        alert(res.data.message)
        navigate('/mainlayout')
      } else {
        seterror('No token received from server')
      }
    } catch (err) {
      seterror(err.response?.data?.message || 'Login Failed')
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-5xl min-h-[620px] bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-12 text-white flex-col justify-between overflow-hidden">

          <div className="absolute -top-32 -right-32 w-80 h-80 bg-white rounded-full blur-3xl opacity-10"></div>

          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-900 rounded-full blur-3xl opacity-30"></div>

          <div className="relative z-10">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer w-fit"
            >
              <div className="w-11 h-11 flex items-center justify-center bg-white text-blue-600 text-2xl font-extrabold rounded-xl">
                L
              </div>

              <span className="text-2xl font-bold">
                Linkup
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Welcome back
            </p>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Your people
              <br />
              are waiting.
            </h1>

            <p className="mt-6 text-blue-100 leading-relaxed max-w-md">
              Log in to continue your conversations, discover new people,
              and stay connected with the communities that matter to you.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-blue-100">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-blue-600"></div>
              <div className="w-8 h-8 rounded-full bg-indigo-300 border-2 border-blue-600"></div>
              <div className="w-8 h-8 rounded-full bg-sky-300 border-2 border-blue-600"></div>
            </div>

            <span>Connect with your community</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">

          {/* Mobile Logo */}
          <div
            onClick={() => navigate('/')}
            className="md:hidden flex items-center gap-2 mb-10 cursor-pointer w-fit"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white text-xl font-bold rounded-xl">
              L
            </div>

            <span className="text-2xl font-bold text-gray-950">
              Linkup
            </span>
          </div>

          <div className="max-w-md w-full mx-auto">

            <div className="mb-8">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-950">
                Login to Linkup
              </h2>

              <p className="mt-3 text-gray-500">
                Enter your details to continue to your account.
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlesubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>

                <input
                  name="username"
                  value={formdata.username}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={handlechange}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  name="password"
                  type="password"
                  value={formdata.password}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={handlechange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-400">
                New to Linkup?
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <button
              onClick={() => navigate('/register')}
              className="w-full py-3.5 rounded-xl border border-gray-300 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Create an Account
            </button>

            <p className="text-center text-xs text-gray-400 mt-8">
              By continuing, you agree to Linkup's terms and privacy policy.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login