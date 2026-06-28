'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });

      console.log("Login successful!", response.data);
      
      const loggedInUser = response.data.user;
      const token = response.data.access_token;
      
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      if (token) {
        localStorage.setItem('token', token);
      }

      if (loggedInUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (loggedInUser.role === 'company') {
        router.push('/company/dashboard');
      } else if (loggedInUser.role === 'employee') {
        router.push('/employee/dashboard');
      } else {
        router.push('/reviewer_dashboard');
      }

    } catch (err) {
      console.error("Login failed", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center relative py-12 sm:px-6 lg:px-8">

      {/* Back Button */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          BACK TO HOME
        </Link>
      </div>

      {/* Login Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-16 sm:mt-0">
        <div className="flex justify-center items-center gap-2">
          <div className="w-12 h-12 bg-brand-red flex items-center justify-center">
            <span className="text-white font-bold text-2xl leading-none">S</span>
          </div>
          <span className="font-bold text-4xl tracking-widest uppercase text-brand-black">SkillSeed</span>
        </div>
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight uppercase text-brand-black">
          SIGN IN TO YOUR ACCOUNT
        </h2>
      </div>

      {/* Login Card */}
      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 sm:px-12 border border-brand-black/20 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red px-4 py-3 text-sm font-bold tracking-wide uppercase">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-brand-black">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-brand-black placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-colors rounded-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-brand-black">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-brand-black placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-colors rounded-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 appearance-none border border-brand-black bg-white checked:bg-brand-red checked:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 cursor-pointer transition-colors relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1.5 after:top-0.5 after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                />
                <label htmlFor="remember-me" className="block text-xs font-bold uppercase tracking-wider text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider">
                <Link href="/forgot-password" className="text-brand-black hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center bg-brand-black px-4 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-brand-red transition-colors cursor-pointer rounded-none"
              >
                SIGN IN
              </button>
            </div>
          </form>
          
          <p className="mt-12 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
            Not a member?{' '}
            <Link href="/signup" className="text-brand-black hover:text-brand-red transition-colors border-b border-brand-black hover:border-brand-red pb-0.5 ml-1">
              CREATE AN ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
