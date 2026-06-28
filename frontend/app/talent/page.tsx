'use client';

import { useEffect } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { StarIcon, CodeBracketIcon, PaintBrushIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const talents = [
  { name: 'ALEX RIVERA', role: 'Frontend Developer', skills: ['React', 'Next.js', 'GSAP'], rating: 4.9, icon: CodeBracketIcon },
  { name: 'SARAH CHEN', role: 'Data Analyst', skills: ['Python', 'SQL', 'Tableau'], rating: 5.0, icon: ChartBarIcon },
  { name: 'MARCUS JOHNSON', role: 'UI/UX Designer', skills: ['Figma', 'Prototyping', 'User Research'], rating: 4.8, icon: PaintBrushIcon },
  { name: 'ELENA RODRIGUEZ', role: 'Marketing Strategy', skills: ['SEO', 'Content', 'Analytics'], rating: 4.9, icon: ChartBarIcon },
  { name: 'DAVID KIM', role: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'Docker'], rating: 5.0, icon: CodeBracketIcon },
  { name: 'PRIYA PATEL', role: 'Visual Designer', skills: ['Illustrator', 'Branding', 'Motion'], rating: 4.7, icon: PaintBrushIcon },
];

export default function TalentPage() {
  useEffect(() => {
    // Initial reveal
    gsap.fromTo('.talent-row', 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="bg-brand-black text-white min-h-screen">
      <Header />
      
      <section className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 lg:px-12 bg-brand-black">
        <div className="max-w-[1400px] mx-auto w-full">
          
          <div className="mb-16">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter uppercase leading-[0.85] mb-6">
              TOP <span className="text-brand-red">TALENT</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Discover our highest-rated students and freelancers. Ready to jump in and make an immediate impact on your projects.
            </p>
          </div>
          
          <div className="border-t border-white/20">
            {talents.map((talent, idx) => (
              <div 
                key={idx} 
                className="talent-row group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/20 hover:bg-white/5 transition-colors duration-300 cursor-pointer px-4 -mx-4"
              >
                <div className="flex items-center gap-8 md:w-1/3 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                    <talent.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight uppercase group-hover:text-brand-red transition-colors">{talent.name}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{talent.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 md:w-1/3 mb-4 md:mb-0 flex-wrap">
                  {talent.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 border border-white/20 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:border-brand-red/50 group-hover:text-gray-200 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-6 md:w-1/3 justify-end">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-brand-red fill-brand-red" />
                    <span className="text-xl font-bold">{talent.rating}</span>
                  </div>
                  <button className="px-6 py-3 border border-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-brand-black transition-colors">
                    View Profile
                  </button>
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
