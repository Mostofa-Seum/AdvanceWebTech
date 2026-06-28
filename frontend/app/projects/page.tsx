'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const categories = ['All', 'Development', 'Design', 'Marketing', 'Data'];

const projects = [
  { id: 1, title: 'Build React Dashboard', company: 'TechNova', category: 'Development', price: '$150', time: '15 hrs' },
  { id: 2, title: 'UI UX Audit', company: 'Studio Elevate', category: 'Design', price: '$80', time: '8 hrs' },
  { id: 3, title: 'SEO Content Strategy', company: 'GrowthX', category: 'Marketing', price: '$120', time: '12 hrs' },
  { id: 4, title: 'Python Web Scraper', company: 'DataCorp', category: 'Development', price: '$200', time: '20 hrs' },
  { id: 5, title: 'Brand Guidelines', company: 'Lumina', category: 'Design', price: '$300', time: '25 hrs' },
  { id: 6, title: 'Data Cleaning Script', company: 'QuantHQ', category: 'Data', price: '$90', time: '10 hrs' },
  { id: 7, title: 'Social Media Assets', company: 'ViralTrends', category: 'Design', price: '$75', time: '5 hrs' },
  { id: 8, title: 'API Integration', company: 'SyncFlow', category: 'Development', price: '$250', time: '18 hrs' },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const gridRef = useRef(null);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  useEffect(() => {
    // Animate items on category change
    gsap.fromTo('.project-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
    );
  }, [activeCategory]);

  return (
    <div className="bg-[#f2f2f2] text-brand-black min-h-screen">
      <Header />
      
      <section className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-[1400px] mx-auto w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter uppercase leading-[0.85]">
              AVAILABLE <br/><span className="text-brand-red">TASKS</span>
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
          
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-black pt-12">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card group border border-gray-300 p-8 hover:bg-brand-black hover:text-white transition-colors duration-300 cursor-pointer flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-red">{project.category}</span>
                    <ArrowUpRightIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase leading-tight mb-4">{project.title}</h3>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-400">{project.company}</p>
                </div>
                
                <div className="flex justify-between items-end mt-8 border-t border-gray-200 group-hover:border-white/20 pt-4">
                  <div className="text-xl font-bold">{project.price}</div>
                  <div className="text-sm font-bold tracking-widest text-gray-400">{project.time}</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}
