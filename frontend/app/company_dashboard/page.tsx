'use client';
import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { Job } from "@/app/types/interfaces";
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    loadJobs();
  }, []);
  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded shadow">
          <h2>Total Jobs</h2>
          <p className="text-3xl font-bold mt-2">{jobs.length}</p>
        </div>
      </div>
    </div>
  );
}