'use client';

import { useEffect, useRef } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRightIcon, 
  MapPinIcon,
  StarIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    title: 'MICRO-INTERNSHIPS',
    desc: 'Bite-sized, paid professional assignments. Complete 10-40 hour projects for real companies, build your portfolio, and gain practical experience.',
    stats: '10-40 HOURS',
    details: 'Remote or On-site'
  },
  {
    title: 'DIRECT HIRING',
    desc: 'Skip the resume pile. Companies hire directly based on the quality of your completed micro-internship deliverables.',
    stats: 'FULL-TIME & PART-TIME',
    details: 'Skill-based matching'
  },
  {
    title: 'SKILL VALIDATION',
    desc: 'Earn verifiable credentials for every task you complete. Prove your worth with data-backed performance metrics.',
    stats: 'VERIFIED BADGES',
    details: 'Industry recognized'
  },
  {
    title: 'MENTORSHIP',
    desc: 'Connect with industry veterans. Get feedback on your work and guidance on navigating your career path.',
    stats: '1-ON-1 SESSIONS',
    details: 'Expert feedback'
  }
];

const topTalent = [
  { name: 'Alex Rivera', role: 'Frontend Developer', rating: 4.9 },
  { name: 'Sarah Chen', role: 'Data Analyst', rating: 5.0 },
  { name: 'Marcus Johnson', role: 'UI/UX Designer', rating: 4.8 },
  { name: 'Elena Rodriguez', role: 'Marketing Strategy', rating: 4.9 },
  { name: 'David Kim', role: 'Backend Engineer', rating: 5.0 },
  { name: 'Priya Patel', role: 'Content Writer', rating: 4.7 },
];

export default function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const metricsRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  const talentMarqueeRef = useRef(null);

  useEffect(() => {
    // 1. Hero Reveal Animation
    const heroTexts = gsap.utils.toArray('.hero-reveal');
    gsap.fromTo(heroTexts, 
      { y: '100%' }, 
      { 
        y: '0%', 
        duration: 1.2, 
        stagger: 0.1, 
        ease: 'power4.out',
        delay: 0.2
      }
    );

    // 2. About Scrubbing Text
    gsap.fromTo('.about-scrub', 
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 70%',
          end: 'center center',
          scrub: true,
        }
      }
    );

    // 3. Metrics Counters
    const metrics = gsap.utils.toArray('.metric-number');
    metrics.forEach((metric: any) => {
      const target = parseInt(metric.getAttribute('data-target') || '0', 10);
      gsap.fromTo(metric,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 80%',
            once: true
          },
          onUpdate: function() {
            metric.innerHTML = Math.round(this.targets()[0].textContent) + (metric.getAttribute('data-suffix') || '');
          }
        }
      );
    });

    gsap.fromTo('.metric-item', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: metricsRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );

    // 4. Horizontal Scroll
    const wrapper = horizontalWrapperRef.current as any;
    
    // Calculate the total scrollable width
    const getScrollAmount = () => {
      let wrapperWidth = wrapper.scrollWidth;
      return -(wrapperWidth - window.innerWidth);
    };

    const tween = gsap.to(wrapper, {
      x: getScrollAmount,
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: horizontalRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true
    });

    // 5. Marquee Animation
    gsap.to(talentMarqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#f2f2f2] text-brand-black min-h-screen font-sans selection:bg-brand-red selection:text-white">
      <Header />
      
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative z-10 w-full min-h-screen flex flex-col justify-end pt-32 pb-12 sm:pb-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="overflow-hidden mb-2">
            <h1 className="hero-reveal text-[12vw] sm:text-[10vw] font-bold tracking-tighter uppercase leading-[0.8] text-brand-black m-0 p-0">
              BUILD YOUR
            </h1>
          </div>
          <div className="overflow-hidden mb-2">
            <h1 className="hero-reveal text-[12vw] sm:text-[10vw] font-bold tracking-tighter uppercase leading-[0.8] text-brand-red m-0 p-0">
              EXPERIENCE
            </h1>
          </div>
          <div className="overflow-hidden mb-12">
            <h1 className="hero-reveal text-[12vw] sm:text-[10vw] font-bold tracking-tighter uppercase leading-[0.8] text-brand-black m-0 p-0">
              ONE TASK AT A TIME.
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mt-12">
            <p className="hero-reveal text-xl sm:text-2xl font-medium text-gray-500 max-w-xl leading-relaxed">
              Tailored micro-internships for ambitious students and high-growth companies looking for verified talent.
            </p>
            <div className="hero-reveal">
               <Link href="/login" className="group flex items-center gap-4 bg-brand-black px-8 py-5 text-sm font-bold uppercase tracking-widest text-white hover:bg-brand-red transition-colors duration-300">
                GET STARTED
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-12 flex items-center gap-4 hidden sm:flex">
          <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-black overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-red animate-[slideDown_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION (Text Scrub) */}
      <section ref={aboutRef} className="relative z-10 py-32 sm:py-48 px-6 lg:px-12 bg-brand-black text-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-red mb-12">Our Mission</h2>
          <p className="about-scrub text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase leading-[1.1] max-w-5xl">
            A GLOBAL PLATFORM FOCUSED ON DRIVING STUDENT CAREER GROWTH THROUGH REAL-WORLD, MEASURABLE MICRO-INTERNSHIPS.
          </p>
        </div>
      </section>

      {/* 3. METRICS GRID */}
      <section ref={metricsRef} className="relative z-10 py-32 px-6 lg:px-12 bg-[#f2f2f2] border-t border-gray-300">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 border-t border-black pt-12">
            <div className="metric-item">
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Founded</div>
              <div className="text-6xl sm:text-7xl font-bold tracking-tighter text-brand-black metric-number" data-target="2024">0</div>
            </div>
            <div className="metric-item">
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Tasks Completed</div>
              <div className="text-6xl sm:text-7xl font-bold tracking-tighter text-brand-black metric-number" data-target="15000" data-suffix="+">0</div>
            </div>
            <div className="metric-item">
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Students Placed</div>
              <div className="text-6xl sm:text-7xl font-bold tracking-tighter text-brand-black metric-number" data-target="4500" data-suffix="+">0</div>
            </div>
            <div className="metric-item">
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Partner Companies</div>
              <div className="text-6xl sm:text-7xl font-bold tracking-tighter text-brand-black metric-number" data-target="350" data-suffix="+">0</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTIONS HORIZONTAL SCROLL */}
      <section ref={horizontalRef} className="relative z-10 h-screen w-full bg-brand-black text-white overflow-hidden flex flex-col justify-center">
        <div className="absolute top-12 left-6 lg:left-12 flex items-center gap-4 z-10">
          <div className="w-4 h-4 bg-brand-red"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Our Solutions</h2>
        </div>
        
        <div ref={horizontalWrapperRef} className="flex gap-12 sm:gap-24 px-6 lg:px-32 items-center h-full w-max mt-16">
          {solutions.map((solution, i) => (
            <div key={i} className="w-[85vw] sm:w-[60vw] md:w-[45vw] shrink-0 border border-white/20 p-12 sm:p-16 flex flex-col min-h-[60vh] justify-between hover:bg-white/5 transition-colors duration-500 group">
              <div>
                <h3 className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase mb-8">{solution.title}</h3>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed font-medium group-hover:text-gray-200 transition-colors">{solution.desc}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-8 border-t border-white/20 mt-8 gap-4">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-brand-red mb-2">Structure</div>
                  <div className="text-2xl font-bold tracking-tight">{solution.stats}</div>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Format</div>
                  <div className="text-xl tracking-tight text-gray-300">{solution.details}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GLOBAL REACH (Minimalist Parallax-ish) */}
      <section className="relative z-10 py-32 sm:py-48 px-6 lg:px-12 bg-[#f2f2f2] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
           <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase leading-[0.9] max-w-4xl mb-24">
             POWERING EARLY CAREERS ACROSS THE GLOBE.
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="text-xl text-gray-600 leading-relaxed font-medium">
               We partner with high-growth startups and established enterprises worldwide to bring verifiable, impactful tasks directly to ambitious students, no matter where they are.
             </div>
             <div className="grid grid-cols-2 gap-8 text-2xl font-bold uppercase tracking-tight">
               <div className="flex items-center gap-3"><MapPinIcon className="w-6 h-6 text-brand-red"/> NORTH AMERICA</div>
               <div className="flex items-center gap-3"><MapPinIcon className="w-6 h-6 text-brand-red"/> EUROPE</div>
               <div className="flex items-center gap-3"><MapPinIcon className="w-6 h-6 text-brand-red"/> ASIA PACIFIC</div>
               <div className="flex items-center gap-3"><MapPinIcon className="w-6 h-6 text-brand-red"/> LATIN AMERICA</div>
             </div>
           </div>
        </div>
      </section>

      {/* 6. TOP TALENT (Marquee) */}
      <section className="relative z-10 py-24 bg-brand-black text-white overflow-hidden border-t border-white/10">
        <div className="px-6 lg:px-12 mb-16 flex items-center gap-4">
          <div className="w-4 h-4 bg-brand-red"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Featured Talent</h2>
        </div>
        
        {/* Double width for seamless looping */}
        <div className="flex w-[200%] whitespace-nowrap" ref={talentMarqueeRef}>
          <div className="flex w-1/2 justify-around items-center gap-12 px-6">
             {topTalent.map((talent, i) => (
                <div key={`a-${i}`} className="flex flex-col gap-2 shrink-0">
                  <div className="text-4xl font-bold tracking-tighter uppercase">{talent.name}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-brand-red uppercase tracking-widest font-bold text-sm">{talent.role}</span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm"><StarIcon className="w-4 h-4 fill-brand-red text-brand-red" /> {talent.rating}</span>
                  </div>
                </div>
             ))}
          </div>
          <div className="flex w-1/2 justify-around items-center gap-12 px-6">
             {topTalent.map((talent, i) => (
                <div key={`b-${i}`} className="flex flex-col gap-2 shrink-0">
                  <div className="text-4xl font-bold tracking-tighter uppercase">{talent.name}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-brand-red uppercase tracking-widest font-bold text-sm">{talent.role}</span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm"><StarIcon className="w-4 h-4 fill-brand-red text-brand-red" /> {talent.rating}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Required style for the custom scroll indicator animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </div>
  );
}