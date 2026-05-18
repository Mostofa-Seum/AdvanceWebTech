'use client'

import Link from 'next/link'
import { useState, FormEvent, JSX } from "react";
import { z } from "zod";
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Zod schema
const registrationSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  address: z
    .string()
    .min(5, { message: "Address is too short" }),
  role: z
    .enum(["company", "employee", "reviewer", "admin"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmpassword: z.string(),
})
.refine((data) => data.password === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

export default function RegistrationPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<string>("reviewer");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = registrationSchema.safeParse({ fullName, phone, address, role, email, password, confirmpassword });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      // Connect to the unified backend signup
      const response = await axios.post('http://localhost:3000/reviewer/signup', {
        fullName,
        phone,
        address,
        role,
        email,
        password
      });
      
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center relative isolate sm:px-6 lg:px-8 py-12">
      {/* Background Gradient */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/homepage" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <AcademicCapIcon className="h-10 w-auto text-indigo-600 dark:text-indigo-500" />
          <span className="font-bold text-3xl tracking-tight text-gray-900 dark:text-white">SkillSeed</span>
        </div>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          Create an account
        </h2>
      </div>

      {/* Registration Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[500px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-10 shadow-sm sm:rounded-xl sm:px-12 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative text-sm">{error}</div>}
            {success && <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded relative text-sm">{success}</div>}
            
            <div>
              <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  Address
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  I am a
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  >
                    <option value="reviewer">Reviewer</option>
                    <option value="company">Company</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmpassword" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    type="password"
                    required
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Already a member?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
