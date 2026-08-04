'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewJobPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', budget: '', deadline: '', categoryId: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setCompanyId(JSON.parse(stored)?.company?.companyId || ''); } catch {}
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/jobs/categories`).then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.budget || !form.deadline) {
      setError('All fields except category are required');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/jobs?companyId=${companyId}`, {
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        deadline: new Date(form.deadline).toISOString(),
        categoryId: form.categoryId || undefined,
      });
      router.push('/company/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold text-brand-black';

  return (
    <div className="max-w-3xl">
      <Link href="/company/jobs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red mb-6">
        <ArrowLeftIcon className="h-4 w-4" /> BACK TO JOBS
      </Link>
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 mb-8">POST A NEW JOB</h2>

      {error && <div className="mb-6 p-4 text-xs font-bold uppercase tracking-widest text-brand-red bg-white border-2 border-brand-red">{error}</div>}

      <form onSubmit={submit} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Job Title</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Build a React dashboard" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Description</label>
          <textarea rows={5} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the task, deliverables and requirements" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Budget (USD)</label>
            <input type="number" min="1" step="0.01" className={inputCls} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="150.00" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Deadline</label>
            <input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Category</label>
          <select className={`${inputCls} uppercase cursor-pointer`} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">— None —</option>
            {categories.map((c) => (<option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>))}
          </select>
        </div>
        <button type="submit" disabled={submitting} className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer disabled:opacity-60">
          {submitting ? 'POSTING…' : 'POST JOB'}
        </button>
      </form>
    </div>
  );
}
