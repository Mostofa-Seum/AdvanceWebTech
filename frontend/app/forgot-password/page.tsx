'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/forgot-password`, { email });
      setSuccess('OTP sent successfully to your email. Please check your inbox.');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid OTP or password format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center relative py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/login" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          BACK TO LOGIN
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-16 sm:mt-0">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight uppercase text-brand-black mb-4">
            PASSWORD RECOVERY
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {step === 1 ? 'Enter your email to receive a secure OTP' : 'Enter your OTP and new password'}
          </p>
        </div>

        <div className="bg-white px-6 py-12 sm:px-12 border border-brand-black/20 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          {error && (
            <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red px-4 py-3 text-sm font-bold tracking-wide uppercase mb-8">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-600 text-green-700 px-4 py-3 text-sm font-bold tracking-wide uppercase mb-8">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-brand-black placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-colors rounded-none"
                  placeholder="name@example.com"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center bg-brand-black px-4 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-brand-red transition-colors cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SENDING...' : 'SEND OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">6-Digit OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-brand-black placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-colors rounded-none tracking-[0.5em] text-center font-mono"
                  placeholder="------"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full border border-gray-300 bg-white px-4 py-3 text-base text-brand-black placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-colors rounded-none"
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center bg-brand-black px-4 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-brand-red transition-colors cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
