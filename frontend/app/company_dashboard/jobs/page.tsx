'use client';
import { useEffect, useState } from "react";
import api from "../../services/api";
import JobCard from "../components/JobCard";
import { Job } from "../../types/interfaces";
export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    loadJobs();
  }, []);
  async function loadJobs() {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await api.get(
        `/company/job/search?companyName=${user.companyName}`
      );
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-semibold">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200 my-4">
        {error}
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {jobs.map((job: Job) => (
            <JobCard key={job.jobId} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}