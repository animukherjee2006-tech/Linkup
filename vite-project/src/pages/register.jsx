
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
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react'
import logregphoto from '../assets/logreghomepage.png'

const API_URL = 'https://linkup-144b.onrender.com/api/auth'

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
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)

  const [loading, setloading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const [error, seterror] = useState('')
  const [success, setSuccess] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const handlechange = (e) => {
    const { name, value } = e.target

    setformdata((prev) => ({
      ...prev,
      [name]: value
    }))

    seterror('')
  }

  // STEP 1: REGISTER AND SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formdata.password !== confirmPassword) {
      seterror('Passwords do not match')
      return
    }

    if (formdata.password.length < 8) {
      seterror('Password must contain at least 8 characters')
      return
    }

    setloading(true)
    seterror('')
    setSuccess('')

    try {
      const payload = {
        ...formdata,
        email: formdata.email.trim().toLowerCase()
      }

      await Axios.post(
        `${API_URL}/register`,
        payload,
        { withCredentials: true }
      )

      setformdata(payload)
      setShowOtp(true)
      setSuccess('Verification code sent to your email.')
    } catch (err) {
      seterror(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setloading(false)
    }
  }

  // STEP 2: VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!/^\d{6}$/.test(otp)) {
      seterror('Please enter a valid 6-digit OTP')
      return
    }

    setOtpLoading(true)
    seterror('')
    setSuccess('')

    try {
      const res = await Axios.post(
        `${API_URL}/verify-otp`,
        {
          Email: formdata.email.trim().toLowerCase(),
          otp
        },
        { withCredentials: true }
      )

      // Prefer the HTTP-only cookie for authentication.
      // Keep this fallback only if your backend still returns a token.
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }

      localStorage.setItem('isLoggedIn', 'true')

      setSuccess('Email verified successfully!')

      navigate('/mainlayout')
    } catch (err) {
      seterror(
        err.response?.data?.message ||
        'OTP verification failed. Please try again.'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  const inputClass =
    'w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'

  // OTP VERIFICATION SCREEN
  if (showOtp) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6">

        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT IMAGE */}
          <div className="hidden md:block relative min-h-[600px]">
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
                One last step.
                <br />
                <span className="text-blue-300">
                  Verify your email.
                </span>
              </h2>

              <p className="mt-4 text-blue-100/80 text-sm leading-6 max-w-sm">
                Verify your email address to complete your
                registration and become part of the Linkup community.
              </p>
            </div>
          </div>

          {/* RIGHT OTP PANEL */}
          <div className="px-6 py-10 sm:px-10 flex items-center">
            <div className="w-full max-w-md mx-auto">

              {/* MOBILE LOGO */}
              <div
                onClick={() => navigate('/')}
                className="md:hidden flex items-center gap-2 mb-8 cursor-pointer"
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

              {/* OTP ICON */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <ShieldCheck
                  size={32}
                  className="text-blue-600"
                />
              </div>

              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                Email verification
              </p>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Check your inbox
              </h1>

              <p className="mt-3 text-sm text-slate-500 leading-6">
                We've sent a 6-digit verification code to
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800 break-all">
                {formdata.email}
              </p>

              {/* FEEDBACK */}
              {error && (
                <div className="mt-5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 px-3.5 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
                  {success}
                </div>
              )}

              {/* OTP FORM */}
              <form
                onSubmit={handleVerifyOTP}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enter verification code
                  </label>

                  <input
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6)
                      )
                      seterror('')
                      setSuccess('')
                    }}
                    placeholder="000000"
                    required
                    className="w-full h-16 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-center text-3xl font-bold tracking-[0.65em] pl-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Enter the code before it expires.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {otpLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} />
                      <span>Verify & Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* BACK TO REGISTRATION */}
              <button
                type="button"
                onClick={() => {
                  setShowOtp(false)
                  setOtp('')
                  seterror('')
                  setSuccess('')
                }}
                className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
              >
                <ArrowLeft size={15} />
                Back to registration
              </button>

              <p className="mt-6 text-center text-xs text-slate-400 leading-5">
                Didn't receive the code? Check your spam folder
                or try registering again after the code expires.
              </p>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // REGISTRATION SCREEN
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

        {/* RIGHT REGISTRATION FORM */}
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

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >
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

              {/* FIRST + LAST NAME */}
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
                    minLength={8}
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
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      seterror('')
                    }}
                    required
                    minLength={8}
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

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending verification code...
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
                type="button"
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
