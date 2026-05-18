"use client";
import { useState, FormEvent, JSX } from "react";
import { z } from "zod";
import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
const registrationSchema = z
  .object({
    companyName: z
      .string()
      .min(1, { message: "Company name required" })
      .max(200, { message: "Company name cannot exceed 200 characters" })
      .regex(/^[A-Za-z0-9\s.&-]+$/, {
        message: "Company name contains invalid characters",
      }),
    description: z.string().optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal('')),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmpassword: z.string(),
    logo: z
      .custom<File>((file) => file instanceof File, {
        message: "Company logo is required",
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Logo must be less than 2MB",
      })
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          ),
        {
          message: "Only JPG, JPEG, PNG and WEBP files are allowed",
        }
      ),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export default function RegistrationPage(): JSX.Element {
  const [companyName, setCompanyName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = registrationSchema.safeParse({
      companyName,
      description,
      website,
      email,
      password,
      confirmpassword,
      logo,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('companyName', companyName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);

      if (description.trim()) formData.append('description', description.trim());
      if (website.trim()) formData.append('website', website.trim());

      if (logo) {
        formData.append('logo', logo);
      }

      const response = await axios.post('http://localhost:3000/company/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      setSuccess("Registration successful! Status: PENDING review.");

      setCompanyName("");
      setDescription("");
      setWebsite("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLogo(null);

      const fileInput = document.getElementById('logo') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data?.message;
        setError(Array.isArray(serverError) ? serverError[0] : serverError || "Registration failed");
      } else {
        setError("An unexpected network fault occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center relative isolate py-12 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <AcademicCapIcon className="h-10 w-auto text-indigo-600" />
          <span className="font-bold text-3xl text-gray-900 dark:text-white">SkillSeed</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow-sm sm:rounded-xl sm:px-12 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" rows={3} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Website</label>
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Confirm Password</label>
              <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white px-3 py-1.5 focus:outline-indigo-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Company Logo</label>
              <input type="file" id="logo" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-indigo-50 file:text-indigo-700" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}