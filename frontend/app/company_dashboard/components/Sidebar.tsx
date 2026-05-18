'use client'

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-5 min-h-screen">

      <h1 className="text-2xl font-bold mb-10">
        SkillSeed
      </h1>

      <nav className="space-y-4">

        <Link
          href="/company_dashboard"
          className="block hover:text-indigo-400 transition-colors"
        >
          Dashboard
        </Link>

        <Link
          href="/company_dashboard/profile"
          className="block hover:text-indigo-400 transition-colors"
        >
          Profile
        </Link>

        <Link
          href="/company_dashboard/jobs"
          className="block hover:text-indigo-400 transition-colors"
        >
          Jobs
        </Link>

        <Link
          href="/company_dashboard/jobs/create"
          className="block hover:text-indigo-400 transition-colors"
        >
          Create Job
        </Link>
        <Link
          href="/company_dashboard/applicants"
          className="block hover:text-indigo-400 transition-colors"
        >
          Applicants
        </Link>

        <Link
          href="/company_dashboard/payments"
          className="block hover:text-indigo-400 transition-colors"
        >
          Payments
        </Link>

        <Link
          href="/company_dashboard/review"
          className="block hover:text-indigo-400 transition-colors"
        >
          Review Employee
        </Link>

        <Link
          href="/company_dashboard/report"
          className="block hover:text-indigo-400 transition-colors"
        >
          Report Employee
        </Link>

      </nav>

    </div>
  );
}