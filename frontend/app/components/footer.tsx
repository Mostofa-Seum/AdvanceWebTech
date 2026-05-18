import { AcademicCapIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-800 pb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AcademicCapIcon className="h-8 w-auto text-indigo-500" />
              <span className="font-bold text-2xl tracking-tight">SkillSeed</span>
            </div>
            <p className="text-gray-400 max-w-md">
              The leading platform for student micro-internships. Empowering the next generation of tech talent through real-world experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">Contact Info</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" /> support@SkillSeed.com
                </li>
                <li>Dhaka, Bangladesh</li>
                <li>American International University-Bangladesh (AIUB)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 SkillSeed. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}