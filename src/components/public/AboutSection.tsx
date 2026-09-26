import React from 'react';
import { 
  User, Calendar, Flag, Heart, Languages, MapPin, 
  GraduationCap, BookOpen, Award, CheckCircle2, Compass, Shield
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';

interface AboutSectionProps {
  data: PortfolioData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  return (
    <section id="about" className="py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Profile & Educational Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Commitment to Pedagogical & Administrative Excellence
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Bridging instructional mastery in Social Studies with systematic school administration, regulatory PEAC-ESC compliance, and holistic student character formation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Biography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-stone-900 dark:text-stone-100">
                    Professional Biography
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Secondary Educator & Academic Coordinator
                  </p>
                </div>
              </div>

              <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {data.bio}
                </p>
                <p>
                  Throughout my tenure as Senior High School Academic Coordinator and committee head at Mary Immaculate School and COPEL School, I have spearheaded curriculum adaptation, teacher observation evaluations, student government empowerment, and disaster risk reduction protocols.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 font-semibold block">Quality Assurance & Audits</strong>
                    <span className="text-stone-600 dark:text-stone-400">Experienced in PEAC-ESC certification frameworks and faculty syllabus calibration.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 font-semibold block">Civic & Historical Instruction</strong>
                    <span className="text-stone-600 dark:text-stone-400">Deep engagement in Philippine politics, world civilizations, and 21st-century critical thinking.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 font-semibold block">Student Governance</strong>
                    <span className="text-stone-600 dark:text-stone-400">Mentored Supreme Secondary Learner Government (SSG) officers in parliamentary and ethical leadership.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 font-semibold block">Community Safety & DRRR</strong>
                    <span className="text-stone-600 dark:text-stone-400">Institutional hazard mapping, earthquake drills, and campus disaster risk management leadership.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Work Card */}
            <div className="bg-gradient-to-br from-amber-600/10 via-white dark:via-stone-900 to-amber-700/5 p-6 rounded-2xl border border-amber-500/20 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Undergraduate Research Capstone</span>
              </div>
              <h4 className="text-lg font-serif-title font-bold text-stone-900 dark:text-stone-100">
                "{data.researchTitle}"
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {data.researchAbstract}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-stone-500 dark:text-stone-400">
                <span>Rizal Technological University</span>
                <span>•</span>
                <span>Focus: Educational Inclusivity & Adult Basic Education</span>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Details & Education (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Education Credential Card */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-stone-900 dark:text-stone-100">
                    Education & Credentials
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Academic Degree & Board Examination
                  </p>
                </div>
              </div>

              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20">
                      {edu.period}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> LPT Passer
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    {edu.institution}
                  </p>
                  {edu.details && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 pt-1 leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Personal Details Card */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-stone-900 dark:text-stone-100">
                    Personal Details
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Curriculum Vitae Information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Birthday</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.personalDetails.birthday}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
                    <Flag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Citizenship</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.personalDetails.citizenship}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
                    <Heart className="w-3.5 h-3.5 text-amber-600" />
                    <span>Civil Status</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.personalDetails.civilStatus}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
                    <Languages className="w-3.5 h-3.5 text-amber-600" />
                    <span>Languages</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.personalDetails.languages.join(', ')}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 dark:text-stone-400 font-medium block">Current Residence</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.socialLinks.location}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
