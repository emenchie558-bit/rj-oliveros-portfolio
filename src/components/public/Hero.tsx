import React from 'react';
import { 
  GraduationCap, Award, MapPin, Phone, Mail, FileDown, 
  ArrowRight, ShieldCheck, CheckCircle2, BookOpen, Users, Compass 
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';

interface HeroProps {
  data: PortfolioData;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onOpenResume, onOpenAdmin }) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-stone-300/20 dark:bg-stone-800/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Licensed Professional Teacher (LPT)</span>
              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
              <span className="normal-case font-medium">BSEd Social Studies</span>
            </div>

            {/* Name & Academic Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
                {data.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-amber-800 dark:text-amber-400">
                {data.subtitle}
              </p>
            </div>

            {/* Hero Tagline / Bio Summary */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
              {data.heroTagline}
            </p>

            {/* Key Leadership Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Senior High School Academic Coordinator
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                PEAC-ESC Accreditation Lead
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                DRRR & SSG Adviser
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>View Project Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="px-6 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold text-sm border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-2 shadow-xs"
              >
                <FileDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Download Resume (CV)</span>
              </button>

              <a
                href="#contact"
                className="px-5 py-3 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium text-sm transition-colors"
              >
                Get in Touch
              </a>
            </div>

            {/* Contact Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
              <a href={`mailto:${data.socialLinks.email}`} className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>{data.socialLinks.email}</span>
              </a>
              <a href={`tel:${data.socialLinks.phone}`} className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{data.socialLinks.phone}</span>
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Parañaque City, Philippines</span>
              </span>
            </div>
          </div>

          {/* Right Column: High-Craft Profile Portrait & Badges (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/30 to-amber-700/20 blur-md group-hover:scale-105 transition-transform duration-500" />
              
              {/* Image Container with Elegant Oval / Circle Framing */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden p-1.5 bg-gradient-to-b from-amber-400 via-stone-300 to-amber-600 shadow-2xl">
                <img
                  src={data.avatarUrl}
                  alt={data.name}
                  className="w-full h-full object-cover rounded-full bg-stone-900 group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to high-res stylized professional educator avatar
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Floating Badge: Licensed Teacher Board Passer */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white dark:bg-stone-900 px-4 py-2 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 fill-amber-500/20" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Licensed Professional Teacher
                </span>
              </div>
            </div>

            {/* Quick Stat Counter Cards below portrait */}
            <div className="grid grid-cols-2 gap-3 mt-10 w-full max-w-sm">
              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  4+
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                  Years Academic Experience
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif-title text-amber-600 dark:text-amber-400">
                  100%
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                  PEAC-ESC Compliance Rating
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  500+
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                  Secondary Students Mentored
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
                  7+
                </div>
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                  Institutional Affiliations
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
