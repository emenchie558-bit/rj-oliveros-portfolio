import React from 'react';
import { Quote, CheckCircle, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { TestimonialItem } from '../../types/portfolio';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Professional Endorsements</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          What School Administrators & Colleagues Say
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          Testimonials from former principals, university academic executives, and guidance counselors regarding Reiner's instructional and administrative rigor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <Quote className="absolute right-6 top-6 w-12 h-12 text-stone-100 dark:text-stone-800 pointer-events-none -z-0" />

            <div className="relative z-10 space-y-4">
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-title">
                  {item.author}
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  {item.role}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {item.organization}
                </p>
              </div>

              {item.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
