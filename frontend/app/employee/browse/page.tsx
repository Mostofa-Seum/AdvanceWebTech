'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowUpRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function EmployeeBrowsePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setEmployeeId(JSON.parse(stored)?.employee?.employeeId || ''); } catch {}
    }
    axios.get('http://localhost:3000/jobs/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!employeeId) return;
    fetchJobs();
  }, [employeeId, activeCategory, search]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ employeeId });
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());
      const res = await axios.get(`http://localhost:3000/employee/jobs?${params.toString()}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo('.job-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
  }, [jobs]);

  const catNames = ['All', ...categories.map((c) => c.categoryName)];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-brand-black pb-6">
        <h2 className="text-4xl md:text-5xl font-black text-brand-black uppercase tracking-tighter">BROWSE <span className="text-brand-red">JOBS</span></h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH BY KEYWORD…"
          className="w-full md:w-80 p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-sm font-bold uppercase tracking-widest text-brand-black"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {catNames.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-brand-black transition-colors ${activeCategory === cat ? 'bg-brand-black text-white' : 'bg-white text-brand-black hover:bg-gray-100'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">NO JOBS FOUND</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-3">Try a different category or keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link key={job.jobId} href={`/employee/jobs/${job.jobId}`} className="job-card group bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-brand-red">{job.category?.categoryName || 'General'}</span>
                  {job.alreadyApplied && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                </div>
                <h3 className="text-xl font-black text-brand-black uppercase tracking-tight leading-tight mb-3">{job.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>
              <div className="flex justify-between items-end mt-6 pt-4 border-t-2 border-gray-200">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Budget</p>
                  <p className="text-xl font-black text-green-700">${Number(job.budget).toFixed(0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Deadline</p>
                  <p className="text-xs font-bold text-brand-black">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
