'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { ArrowUpRightIcon, XMarkIcon, CheckCircleIcon, CalendarIcon, CurrencyDollarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedJob]);

  useEffect(() => {
    // Load categories for the filter bar
    axios.get('http://localhost:3000/jobs/categories')
      .then((r) => setCategories(['All', ...r.data.map((c: any) => c.categoryName)]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [activeCategory]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      const res = await axios.get(`http://localhost:3000/jobs?${params.toString()}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animate items on category change / load
    gsap.fromTo('.project-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
    );
  }, [projects, activeCategory]);

  const handleCardClick = (project: any) => {
    setSelectedJob(project);
  };

  const handleApply = () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let role: string | null = null;
    try { role = stored ? JSON.parse(stored).role : null; } catch {}

    if (role === 'employee') {
      if (selectedJob?.jobId && !selectedJob.jobId.startsWith('demo-')) {
        router.push(`/employee/jobs/${selectedJob.jobId}`);
      } else {
        router.push('/employee/browse');
      }
    } else if (role === 'company') {
      router.push('/company');
    } else {
      router.push('/login');
    }
  };

  const sampleDeliverables = [
    'Comprehensive code/document audit report with actionable recommendations.',
    'Production-ready implementation adhering to standard code style and guidelines.',
    '1-on-1 handoff demo & documentation for internal engineering review.',
  ];

  return (
    <div className="bg-[#f2f2f2] text-brand-black min-h-screen">
      <Header />

      <section className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-[1400px] mx-auto w-full">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
              AVAILABLE <br /><span className="text-brand-red">TASKS</span>
            </h1>

            <div className="flex flex-wrap gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border transition-colors ${
                    activeCategory === cat
                      ? 'bg-brand-black text-white border-brand-black'
                      : 'bg-transparent text-gray-500 border-gray-300 hover:border-brand-black hover:text-brand-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 font-bold uppercase tracking-widest py-24">Loading tasks…</div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-black pt-12">
              {(projects.length > 0 ? projects : [
                {
                  jobId: 'demo-1',
                  title: 'Design System Audit & Component Migration',
                  description: 'Audit existing UI components and migrate to standard Tailwind CSS v4 design tokens with clean accessibility patterns.',
                  budget: 650,
                  deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
                  category: { categoryName: 'Design' },
                  company: { companyName: 'Fintech Corp' }
                },
                {
                  jobId: 'demo-2',
                  title: 'FastAPI Microservice Async Pipeline',
                  description: 'Build asynchronous REST endpoints with Pydantic validation, error tracebacks, and PostgreSQL connection pooling.',
                  budget: 850,
                  deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
                  category: { categoryName: 'Development' },
                  company: { companyName: 'CloudTech Solutions' }
                },
                {
                  jobId: 'demo-3',
                  title: 'Customer Churn Analysis Dashboard',
                  description: 'Analyze subscription metrics and produce interactive visualizations using Python, Pandas, and Plotly.',
                  budget: 500,
                  deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
                  category: { categoryName: 'Data' },
                  company: { companyName: 'Analytics Pro' }
                },
                {
                  jobId: 'demo-4',
                  title: 'B2B Content Strategy & SEO Optimization',
                  description: 'Perform keyword gap analysis and draft high-intent technical blog posts for developer audience.',
                  budget: 400,
                  deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
                  category: { categoryName: 'Marketing' },
                  company: { companyName: 'Growth Velocity' }
                },
                {
                  jobId: 'demo-5',
                  title: 'Mobile App UI/UX Redesign',
                  description: 'Redesign core onboarding screens for native mobile app focusing on user conversion and visual clarity.',
                  budget: 750,
                  deadline: new Date(Date.now() + 86400000 * 8).toISOString(),
                  category: { categoryName: 'Design' },
                  company: { companyName: 'NextGen Apps' }
                },
                {
                  jobId: 'demo-6',
                  title: 'PostgreSQL Query Optimization & Indexing',
                  description: 'Identify slow query bottlenecks, optimize indexes, and refine TypeORM relationships for high throughput.',
                  budget: 900,
                  deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
                  category: { categoryName: 'Development' },
                  company: { companyName: 'DataScale Inc' }
                }
              ]).map((project) => (
                <div
                  key={project.jobId}
                  onClick={() => handleCardClick(project)}
                  className="project-card group border border-gray-300 p-8 hover:bg-brand-black hover:text-white transition-colors duration-300 cursor-pointer flex flex-col justify-between min-h-[300px] bg-white"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-red">{project.category?.categoryName || 'General'}</span>
                      <ArrowUpRightIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight uppercase leading-tight mb-4">{project.title}</h3>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-400 line-clamp-2">{project.description}</p>
                    <p className="text-sm font-bold text-gray-600 group-hover:text-gray-300 mt-3">{project.company?.companyName || 'Company'}</p>
                  </div>

                  <div className="flex justify-between items-end mt-8 border-t border-gray-200 group-hover:border-white/20 pt-4">
                    <div className="text-xl font-bold">${Number(project.budget).toFixed(0)}</div>
                    <div className="text-sm font-bold tracking-widest text-gray-400 group-hover:text-gray-300">{new Date(project.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FULL JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" data-lenis-prevent="true">
          <div className="bg-white border-2 border-brand-black w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(43,43,43,1)] relative" data-lenis-prevent="true">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 text-brand-black hover:text-brand-red hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase tracking-widest">
                {selectedJob.category?.categoryName || 'GENERAL'}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Verified Micro-Internship
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-brand-black uppercase tracking-tight mb-6 leading-tight">
              {selectedJob.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y-2 border-brand-black mb-8 bg-gray-50 p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  <CurrencyDollarIcon className="w-4 h-4 text-brand-red" /> Stipend / Budget
                </div>
                <div className="text-2xl font-black text-brand-black">${Number(selectedJob.budget).toFixed(0)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  <BuildingOfficeIcon className="w-4 h-4 text-brand-red" /> Company
                </div>
                <div className="text-lg font-bold text-brand-black truncate">{selectedJob.company?.companyName || 'Verified Partner'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  <CalendarIcon className="w-4 h-4 text-brand-red" /> Deadline
                </div>
                <div className="text-lg font-bold text-brand-black">{new Date(selectedJob.deadline).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-2">Project Overview</h4>
                <p className="text-gray-700 leading-relaxed text-base font-medium">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-3">Key Deliverables</h4>
                <ul className="space-y-2">
                  {sampleDeliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <CheckCircleIcon className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest border border-gray-300 hover:border-brand-black transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={handleApply}
                className="px-8 py-4 bg-brand-black text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-red transition-colors flex items-center justify-center gap-2"
              >
                Apply For Task <ArrowUpRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

