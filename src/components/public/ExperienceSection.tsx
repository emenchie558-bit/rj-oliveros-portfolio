import React from 'react';
import { Briefcase, Building, Calendar, CheckCircle, Award } from 'lucide-react';
import { WorkExperience } from '../../types/portfolio';

interface ExperienceSectionProps {
  experience: WorkExperience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-24 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>Career Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Work Experience & Educational Leadership
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            A proven record in instructional delivery, academic program planning, faculty supervision, and accreditation quality assurance.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 dark:border-stone-800 space-y-12">
          {experience.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot */}
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-stone-900 transition-all ${
                item.current
                  ? 'bg-amber-600 ring-4 ring-amber-500/20'
                  : 'bg-stone-400 dark:bg-stone-600 group-hover:bg-amber-600'
              }`} />

              {/* Experience Card */}
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all space-y-4">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        {item.period}
                      </span>
                      {item.current && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active Role
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif-title font-bold text-stone-900 dark:text-stone-100 mt-1 leading-snug">
                      {item.role}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-200/50 dark:border-stone-700/50 w-fit shrink-0">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.institution}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Responsibilities list */}
                {item.responsibilities && item.responsibilities.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                      Core Responsibilities & Impact:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                      {item.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
