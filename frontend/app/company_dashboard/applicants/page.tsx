'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/services/api";
import { getUser } from "@/app/utils/auth";

interface Job {
    jobId: string;
    title: string;
    description?: string;
}

export default function ApplicantsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    async function loadJobs() {
        try {
            const user = getUser();
            if (!user) return;
            const res = await api.get(`/company/job/search?companyName=${encodeURIComponent(user.companyName)}`);
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.log(err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-6">Loading jobs...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 dark:text-black">Applicants</h1>

            {jobs.length === 0 ? (
                <p>No jobs found</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Link
                            key={job.jobId}
                            href={`/company_dashboard/applicants/${job.jobId}`}
                        >
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:border-indigo-500 transition-all cursor-pointer">
                                <h2 className="font-bold text-xl dark:text-white">
                                    {job.title}
                                </h2>
                                {job.description && (
                                    <p className="text-gray-500 mt-2">{job.description}</p>
                                )}
                                <p className="mt-4 text-indigo-600 font-medium">
                                    View Applicants →
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}