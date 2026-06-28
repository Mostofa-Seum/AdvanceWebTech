'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Tasks', href: '/projects' },
  { name: 'Talent', href: '/talent' },
  { name: 'Solutions', href: '/solutions/micro-internships' },
  { name: 'Contact', href: '#footer' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200' : 'bg-transparent border-transparent'}`}>
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            {/* Minimalist Logo */}
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            <span className="font-bold text-xl tracking-widest text-brand-black uppercase">SkillSeed</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-brand-black"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-8" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm/6 font-bold uppercase tracking-widest text-brand-black hover:text-brand-red transition-colors">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center">
          {user ? (
            <>
              <span className="text-sm font-bold uppercase tracking-wider text-brand-black mr-4">
                {user.fullName || user.email}
              </span>
              <button 
                type="button" 
                onClick={handleLogout}
                className="text-white bg-brand-black hover:bg-brand-red font-bold uppercase tracking-widest text-xs px-6 py-3 transition-colors cursor-pointer"
              >
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-brand-black hover:text-brand-red transition-colors">
                LOG IN
              </Link>
              <Link href="/signup">
                <button type="button" className="text-white bg-brand-black hover:bg-brand-red font-bold uppercase tracking-widest text-xs px-6 py-3 transition-colors cursor-pointer">
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <span className="font-bold text-xl tracking-widest text-brand-black uppercase">SkillSeed</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-brand-black"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-8" />
            </button>
          </div>
          <div className="mt-12 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block px-3 py-4 text-lg font-bold uppercase tracking-widest text-brand-black hover:text-brand-red"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <span className="text-sm font-bold uppercase tracking-wider text-brand-black">
                      {user.fullName || user.email}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-white bg-brand-black font-bold uppercase tracking-widest text-xs px-6 py-4 w-full text-center"
                    >
                      LOG OUT
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block px-3 py-4 text-lg font-bold uppercase tracking-widest text-brand-black hover:text-brand-red">
                      LOG IN
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <button type="button" className="text-white bg-brand-black font-bold uppercase tracking-widest text-xs px-6 py-4 w-full mt-4">
                        SIGN UP
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}