'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { StarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function TalentPage() {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/talent`)
      .then((r) => setTalents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && talents.length > 0) {
      gsap.fromTo('.talent-row',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [talents, loading]);

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

          {loading ? (
            <div className="text-center text-gray-400 font-bold uppercase tracking-widest py-24">Loading talent…</div>
          ) : (
            <div className="border-t border-white/20">
              {(talents.length > 0 ? talents : [
                {
                  employeeId: 't-1',
                  user: { fullName: 'Alex Rivera' },
                  experience: 'Senior Frontend Developer',
                  skills: 'React, Next.js, TypeScript, TailwindCSS',
                  trustScore: 4.9
                },
                {
                  employeeId: 't-2',
                  user: { fullName: 'Sarah Chen' },
                  experience: 'Data Analyst & ML Specialist',
                  skills: 'Python, SQL, Pandas, Tableau',
                  trustScore: 5.0
                },
                {
                  employeeId: 't-3',
                  user: { fullName: 'Marcus Johnson' },
                  experience: 'Product & UI/UX Designer',
                  skills: 'Figma, Design Systems, Prototyping',
                  trustScore: 4.8
                },
                {
                  employeeId: 't-4',
                  user: { fullName: 'Elena Rodriguez' },
                  experience: 'Growth & Marketing Strategist',
                  skills: 'SEO, Content Strategy, Analytics',
                  trustScore: 4.9
                },
                {
                  employeeId: 't-5',
                  user: { fullName: 'David Kim' },
                  experience: 'Full-Stack Backend Engineer',
                  skills: 'Node.js, NestJS, PostgreSQL, Docker',
                  trustScore: 5.0
                },
                {
                  employeeId: 't-6',
                  user: { fullName: 'Priya Patel' },
                  experience: 'Copywriter & Content Strategist',
                  skills: 'Technical Writing, SEO, UX Writing',
                  trustScore: 4.7
                }
              ]).map((talent, idx) => {
                const skills = (talent.skills || '')
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .slice(0, 4);
                return (
                  <div
                    key={talent.employeeId || idx}
                    className="talent-row group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/20 hover:bg-white/5 transition-colors duration-300 cursor-pointer px-4 -mx-4"
                  >
                    <div className="flex items-center gap-8 md:w-1/3 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight uppercase group-hover:text-brand-red transition-colors">
                          {talent.user?.fullName || 'Anonymous Talent'}
                        </h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                          {talent.experience ? String(talent.experience).slice(0, 50) : 'SkillSeed Talent'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 md:w-1/3 mb-4 md:mb-0 flex-wrap">
                      {skills.length > 0 ? (
                        skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 border border-white/20 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:border-brand-red/50 group-hover:text-gray-200 transition-colors">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 border border-white/20 text-xs font-bold uppercase tracking-widest text-gray-600">
                          Skills not listed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 md:w-1/3 justify-end">
                      <div className="flex items-center gap-2">
                        <StarIcon className="w-5 h-5 text-brand-red fill-brand-red" />
                        <span className="text-xl font-bold">{Number(talent.trustScore || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
