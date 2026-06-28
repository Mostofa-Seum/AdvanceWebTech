import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer id="footer" className="bg-brand-black text-white relative z-0 h-screen">
      <div className="sticky bottom-0 h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 lg:px-12">
        
        {/* Massive CTA */}
        <div className="flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full">
          <h2 className="text-[10vw] sm:text-[8vw] font-bold tracking-tighter uppercase leading-[0.8] mb-12">
            THE OPPORTUNITY TO <br />
            <span className="text-brand-red">CREATE</span>, GROW, AND <br />
            LOOK AHEAD.
          </h2>
          <div className="flex items-center gap-6">
            <a href="mailto:support@skillseed.com" className="inline-block bg-white text-brand-black px-12 py-6 text-sm font-bold uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300">
              CONTACT US
            </a>
          </div>
        </div>

        {/* Footer Bottom Links */}
        <div className="max-w-[1400px] mx-auto w-full pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 border-t border-white/10">
          <div className="flex flex-col gap-2">
            <p>© 2026 SKILLSEED. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> support@skillseed.com</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <a href="#" className="hover:text-brand-red transition-colors">Legal Notice</a>
            <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-red transition-colors">Cookies Policy</a>
            <a href="#" className="hover:text-brand-red transition-colors">Whistleblowing Channel</a>
          </div>
        </div>
      </div>
    </footer>
  )
}