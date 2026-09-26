import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, Lock } from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';

interface FooterProps {
  data: PortfolioData;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ data, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-stone-800 flex items-center justify-center font-bold text-xs text-white">
                RJO
              </div>
              <span className="font-serif-title font-bold text-white text-lg">
                {data.name}
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Licensed Professional Teacher (LPT) specializing in Secondary Social Studies Education, School Academic Administration, and PEAC-ESC Quality Accreditation.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2">
              <a href={`mailto:${data.socialLinks.email}`} className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5" /> {data.socialLinks.email}
              </a>
              <span>•</span>
              <a href={`tel:${data.socialLinks.phone}`} className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Phone className="w-3.5 h-3.5" /> {data.socialLinks.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-stone-200">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#about" className="hover:text-amber-400 transition-colors">Profile & Education</a></li>
              <li><a href="#experience" className="hover:text-amber-400 transition-colors">Work Experience</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition-colors">Project Showcase</a></li>
              <li><a href="#skills" className="hover:text-amber-400 transition-colors">Competencies & MELCs</a></li>
              <li><a href="#leadership" className="hover:text-amber-400 transition-colors">Leadership & DRRR</a></li>
              <li><a href="#resume" className="hover:text-amber-400 transition-colors">Download Resume CV</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-stone-200">
              Campus & Location
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{data.socialLinks.location}</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Open to academic appointments, accreditation consultancy, and speaking engagements across Metro Manila.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright row with hidden private admin trigger */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Reiner Joseph B. Oliveros. All rights reserved.</span>
            {/* Discreet discrete administrative lock - subtle and unlabelled for public viewers */}
            <button
              onClick={onOpenAdmin}
              className="text-stone-700 hover:text-stone-500 transition-colors p-1"
              aria-label="Secure portal access"
              title="Secure access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-stone-400">
              Licensed Professional Teacher • Secondary Education Social Studies
            </span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
