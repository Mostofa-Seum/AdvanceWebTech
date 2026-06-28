'use client';

import { useEffect, useRef } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { use } from 'react';

const solutionData: Record<string, any> = {
  'micro-internships': {
    title: 'MICRO-INTERNSHIPS',
    headline: 'BITE-SIZED TASKS, MAXIMUM IMPACT.',
    desc: 'Access micro-internships ranging from 10 to 40 hours. Build your portfolio while getting paid and earning certificates of completion.',
    stats: [
      { label: 'Avg Duration', value: '10-40 Hrs' },
      { label: 'Compensation', value: 'Paid' },
      { label: 'Location', value: 'Remote' },
    ]
  },
  'direct-hiring': {
    title: 'DIRECT HIRING',
    headline: 'SKIP THE RESUME PILE.',
    desc: 'Companies hire directly based on the quality of your completed micro-internship deliverables. Show, don\'t just tell.',
    stats: [
      { label: 'Placement Rate', value: '65%' },
      { label: 'Time to Hire', value: '14 Days' },
      { label: 'Format', value: 'Full-time' },
    ]
  },
  'skill-validation': {
    title: 'SKILL VALIDATION',
    headline: 'PROVE YOUR WORTH WITH DATA.',
    desc: 'Earn verifiable credentials for every task you complete. Prove your worth with data-backed performance metrics.',
    stats: [
      { label: 'Credentials', value: 'Verifiable' },
      { label: 'Metrics', value: 'Data-backed' },
      { label: 'Industry', value: 'Recognized' },
    ]
  },
  'mentorship': {
    title: 'MENTORSHIP',
    headline: 'LEARN FROM THE BEST.',
    desc: 'Connect with industry veterans. Get feedback on your work and guidance on navigating your career path.',
    stats: [
      { label: 'Sessions', value: '1-on-1' },
      { label: 'Feedback', value: 'Expert' },
      { label: 'Network', value: 'Global' },
    ]
  }
};

export default function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const data = solutionData[resolvedParams.slug] || solutionData['micro-internships'];
  
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.stagger-text', 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="bg-[#f2f2f2] text-brand-black min-h-screen">
      <Header />
      
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center pt-32 pb-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-4 mb-12 stagger-text">
            <div className="w-4 h-4 bg-brand-red"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-red">{data.title}</h2>
          </div>
          
          <h1 ref={headerRef} className="text-6xl sm:text-8xl lg:text-[8vw] font-bold tracking-tighter uppercase leading-[0.85] mb-12 stagger-text">
            {data.headline}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-24 pt-12 border-t border-gray-300 stagger-text">
            <p className="text-2xl font-medium text-gray-600 leading-relaxed">
              {data.desc}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {data.stats.map((stat: any, i: number) => (
                <div key={i}>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-3xl font-bold tracking-tight text-brand-black">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
