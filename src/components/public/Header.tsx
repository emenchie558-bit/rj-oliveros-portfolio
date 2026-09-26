import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenAdmin,
  activeSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret keyboard shortcut for Reiner: Ctrl+Shift+A or Alt+A opens admin directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  // Hidden discrete trigger: 4 quick clicks on the RJO emblem opens admin
  const handleLogoClick = (e: React.MouseEvent) => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 4) {
        onOpenAdmin();
        return 0;
      }
      return next;
    });
    setTimeout(() => setClickCount(0), 1500);
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        isScrolled
          ? 'bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm border-b border-stone-200/80 dark:border-stone-800/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Personal Branding with discrete private admin trigger */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Reiner Joseph B. Oliveros, LPT"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              RJO
            </div>
            <div>
              <div className="font-serif-title font-semibold text-stone-900 dark:text-stone-100 tracking-tight leading-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Reiner Joseph B. Oliveros
              </div>
              <div className="text-xs font-medium text-amber-700 dark:text-amber-400 tracking-wide mt-0.5">
                Licensed Professional Teacher (LPT)
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeSection === link.href.substring(1)
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Controls: Dark Mode Toggle Only */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>
            <a
              href="#contact"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs"
            >
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu & Dark Toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-300 rounded-md"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900"
              aria-label="Open mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs"
              >
                Send Inquiry
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
