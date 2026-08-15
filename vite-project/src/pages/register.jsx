import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react'
import logregphoto from '../assets/logreghomepage.png'

function Register() {
  const navigate = useNavigate()

  const [formdata, setformdata] = useState({
    username: '',
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: ''
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formdata.password !== confirmPassword) {
      seterror('Passwords do not match')
      return
    }

    setloading(true)
    seterror('')

    try {
      const res = await Axios.post(
        'https://linkup-144b.onrender.com/api/auth/register',
        formdata,
        {
          withCredentials: true
        }
      )

      const token = res.data.token

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', 'true')

        alert('You are successfully registered')
        navigate('/mainlayout')
      } else {
        alert('Registration successful! Please log in.')
        navigate('/login')
      }
    } catch (err) {
      seterror(
        err.response?.data?.message || 'Registration Failed'
      )
    } finally {
      setloading(false)
    }
  }

  const inputClass =
    'w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block relative min-h-[620px]">

          <img
            src={logregphoto}
            alt="Join Linkup"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/45 to-transparent" />

          <div className="absolute inset-x-8 bottom-8 text-white">

            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <span className="text-xl font-black text-blue-600">
                  L
                </span>
              </div>

              <span className="text-xl font-bold">
                Linkup
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              Meet people.
              <br />
              Build connections.
              <br />
              <span className="text-blue-300">
                Be part of Linkup.
              </span>
            </h2>

            <p className="mt-4 text-blue-100/80 text-sm leading-6 max-w-sm">
              Discover new people, share your ideas and build
              meaningful connections with the Linkup community.
            </p>

          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="px-6 py-7 sm:px-9 sm:py-8 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* MOBILE LOGO */}
            <div
              onClick={() => navigate('/')}
              className="md:hidden flex items-center gap-2 mb-6 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-lg font-black text-white">
                  L
                </span>
              </div>

              <span className="text-xl font-bold text-slate-900">
                Linkup
              </span>
            </div>

            {/* HEADER */}
            <div className="mb-5">

              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                Get started
              </p>

              <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Create your account
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Join Linkup and start connecting with people.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* USERNAME */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="username"
                    value={formdata.username}
                    placeholder="Choose a username"
                    onChange={handlechange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* FIRST + LAST */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="firstname"
                      value={formdata.firstname}
                      placeholder="First name"
                      onChange={handlechange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="lastname"
                      value={formdata.lastname}
                      placeholder="Last name"
                      onChange={handlechange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="phone"
                    type="tel"
                    value={formdata.phone}
                    placeholder="Enter phone number"
                    onChange={handlechange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="email"
                    type="email"
                    value={formdata.email}
                    placeholder="Enter your email"
                    onChange={handlechange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formdata.password}
                    placeholder="Create a password"
                    onChange={handlechange}
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={confirmPassword}
                    placeholder="Confirm password"
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>

            {/* LOGIN */}
            <div className="mt-5 text-center">

              <p className="text-xs text-slate-500">
                Already have an account?
              </p>

              <button
                onClick={() => navigate('/login')}
                className="mt-1 text-sm text-blue-600 font-bold hover:text-indigo-600 transition"
              >
                Sign in to Linkup →
              </button>

            </div>

            {/* TERMS */}
            <p className="text-center text-[10px] text-slate-400 mt-4 leading-4">
              By creating an account, you agree to Linkup's
              terms and privacy policy.
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register