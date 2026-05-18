"use client";

import { useState, FormEvent, JSX } from "react";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/signup`, {
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
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f111a] text-gray-200 p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {}
      <div className="w-full max-w-lg mb-4 z-10">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          ← Back to home
        </Link>
      </div>

      <div className="w-full max-w-lg bg-[#161925] border border-gray-800 rounded-xl shadow-2xl p-8 z-10">
        {}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-white tracking-wide">
              Skill<span className="text-[#6366f1]">Seed</span>
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-300">
            Create your account
          </h2>
        </div>

        {}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900/50 p-3 rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-400 bg-green-950/40 border border-green-900/50 p-3 rounded-lg font-medium">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* নাম */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all placeholder-gray-500 text-sm"
              placeholder="John Doe"
            />
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm"
                placeholder="Dhaka, Bangladesh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Join As
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-gray-300 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm cursor-pointer"
              >
                <option value="" className="bg-[#161925]">
                  -- Select Role --
                </option>
                <option value="employee" className="bg-[#161925]">
                  Worker / Employee
                </option>
                <option value="company" className="bg-[#161925]">
                  Company / Client
                </option>
                <option value="reviewer" className="bg-[#161925]">
                  Reviewer
                </option>
              </select>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 bg-[#1f2335] border border-gray-700 rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {}
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#5a62f1] hover:bg-[#4b52df] font-semibold rounded-lg transition-all shadow-lg shadow-indigo-950/50 mt-4 active:scale-[0.99]"
          >
            Sign up
          </button>
        </form>

        {}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-[#6366f1] hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
