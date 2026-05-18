'use client'

import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      console.log("Login successful");

      const backendUser = response.data.user;

      console.log("Raw backend user payload:", backendUser);

      const normalizedUser = {
        userId: backendUser.userId,
        email: backendUser.email,
        role: backendUser.role,
        companyName: backendUser.companyName || backendUser.fullName || backendUser.name || ""
      };

      localStorage.setItem('user', JSON.stringify(normalizedUser));

      localStorage.setItem('user', JSON.stringify(normalizedUser));

      router.replace('/company_dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center relative isolate sm:px-6 lg:px-8">
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" /> Back to home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <AcademicCapIcon className="h-10 w-auto text-indigo-600 dark:text-indigo-500" />
          <span className="font-bold text-3xl tracking-tight text-gray-900 dark:text-white">SkillSeed</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow-sm sm:rounded-xl sm:px-12 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-indigo-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-indigo-600 text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                Not a member?{' '}
                <a href="/registration" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                  Create an account
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}