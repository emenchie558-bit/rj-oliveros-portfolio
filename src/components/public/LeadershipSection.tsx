import React from 'react';
import { Award, Users, Church, Compass, Heart, ShieldAlert } from 'lucide-react';
import { LeadershipItem } from '../../types/portfolio';

interface LeadershipSectionProps {
  leadership: LeadershipItem[];
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ leadership }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Institutional':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'Civic':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'Religious':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <section id="leadership" className="py-24 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold tracking-wider uppercase">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Community & Institutional Service</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Leadership & Organizational Affiliations
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Active stewardship spanning accreditation taskforces, student government advisory, disaster emergency response, and community youth ministries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadership.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeBadge(item.type)}`}>
                    {item.type} Leadership
                  </span>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    {item.period}
                  </span>
                </div>

                <h3 className="text-base font-serif-title font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  {item.position}
                </h3>

                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  {item.organization}
                </p>

                {item.details && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                    {item.details}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-[11px] text-stone-400">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Service & Community Dedication</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
