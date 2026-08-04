"use client";

import { useState, FormEvent, JSX } from "react";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(150, { message: "Name cannot exceed 150 characters" }),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(100),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(20),
    address: z
      .string()
      .min(5, { message: "Address must be at least 5 characters long" }),
    role: z.enum(["employee", "company", "reviewer"], {
      message: "Please select a valid role",
    }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpPage(): JSX.Element {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = signUpSchema.safeParse({
      fullName,
      email,
      phone,
      address,
      role,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/signup`, {
        fullName,
        email,
        phone,
        address,
        role,
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setFullName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setRole("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(' '));
      } else if (typeof msg === 'string') {
        setError(msg);
      } else if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend server is running and accessible.');
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-brand-black p-4 font-sans py-12 relative">

      {/* Back Button */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          BACK TO HOME
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white border-2 border-brand-black p-8 sm:p-12 z-10 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] mt-16 sm:mt-0">
        
        <div className="flex flex-col items-center mb-10">
          <div className="flex justify-center items-center gap-2">
            <div className="w-12 h-12 bg-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-2xl leading-none">S</span>
            </div>
            <span className="font-bold text-4xl tracking-widest uppercase text-brand-black">SkillSeed</span>
          </div>
          <h2 className="mt-8 text-xl font-bold tracking-tight uppercase text-brand-black">
            CREATE YOUR ACCOUNT
          </h2>
        </div>

        {error && (
          <div className="mb-6 text-sm text-brand-red bg-brand-red/10 border-l-4 border-brand-red p-3 font-bold tracking-wide uppercase">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 text-sm text-green-700 bg-green-50 border-l-4 border-green-600 p-3 font-bold tracking-wide uppercase">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all placeholder-gray-400 text-sm font-bold tracking-widest"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all placeholder-gray-400 text-sm font-bold tracking-widest"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all placeholder-gray-400 text-sm font-bold tracking-widest"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all placeholder-gray-400 text-sm font-bold tracking-widest"
                placeholder="Dhaka, Bangladesh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Join As
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all text-sm font-bold tracking-widest uppercase cursor-pointer appearance-none"
                >
                  <option value="" disabled>-- Select Role --</option>
                  <option value="employee">Worker / Employee</option>
                  <option value="company">Company / Client</option>
                  <option value="reviewer">Reviewer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-black">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all text-sm font-bold tracking-widest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-white border-2 border-brand-black rounded-none text-brand-black focus:border-brand-red focus:ring-0 focus:outline-none transition-all text-sm font-bold tracking-widest"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full p-4 text-white bg-brand-black hover:bg-brand-red font-bold uppercase tracking-widest rounded-none transition-colors shadow-none"
            >
              SIGN UP
            </button>
          </div>
        </form>

        <div className="mt-10 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-brand-black hover:text-brand-red transition-colors border-b border-brand-black hover:border-brand-red pb-0.5 ml-1"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}