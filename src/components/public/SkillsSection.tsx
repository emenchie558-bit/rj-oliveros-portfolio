import React from 'react';
import { 
  CheckCircle2, BookOpen, Layers, Laptop, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { SkillCategory } from '../../types/portfolio';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Educational Administration':
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
      case 'Instructional & Pedagogical':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Technical & Digital Tools':
        return <Laptop className="w-5 h-5 text-amber-600" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>Core Competencies</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Comprehensive Skills & Methodologies
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          Synthesizing educational governance, standards-based instruction (K-12/MELCs), technical cloud tooling, and institutional leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-500/20 flex items-center justify-center mb-4">
                {getIcon(cat.category)}
              </div>

              <h3 className="text-base font-serif-title font-bold text-stone-900 dark:text-stone-100 mb-4 leading-snug">
                {cat.category}
              </h3>

              <ul className="space-y-2.5">
                {cat.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Verified Professional Competency
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
