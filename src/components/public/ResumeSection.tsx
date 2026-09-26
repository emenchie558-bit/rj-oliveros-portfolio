import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Check, Copy, Phone, 
  Mail, MapPin, Award, GraduationCap, Briefcase, Users, ShieldCheck
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';

interface ResumeSectionProps {
  data: PortfolioData;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ data }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedPlainText, setCopiedPlainText] = useState(false);

  const handlePrint = async () => {
    try {
      fetch('/api/analytics/track-download', { method: 'POST' }).catch(() => {});
    } catch (e) {}
    window.print();
  };

  const handleDownloadJSON = () => {
    try {
      fetch('/api/analytics/track-download', { method: 'POST' }).catch(() => {});
    } catch (e) {}

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REINER_JOSEPH_B_OLIVEROS_RESUME.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyPlainText = () => {
    const plain = `
REINER JOSEPH B. OLIVEROS
${data.professionalTitle} - ${data.subtitle}
Address: ${data.socialLinks.location}
Phone: ${data.socialLinks.phone}
Email: ${data.socialLinks.email}

PROFILE:
${data.bio}

EDUCATION:
${data.education.map(e => `${e.degree} - ${e.institution} (${e.period})`).join('\n')}

WORK EXPERIENCE:
${data.workExperience.map(w => `${w.role} | ${w.institution} (${w.period})\n- ${w.description}`).join('\n\n')}

RESEARCH WORK:
"${data.researchTitle}"

REFERENCES:
${data.references.map(r => `${r.name} - ${r.title}, ${r.institution} (Tel: ${r.phone})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(plain);
    setCopiedPlainText(true);
    setTimeout(() => setCopiedPlainText(false), 2000);
  };

  return (
    <section id="resume" className="py-24 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3 no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold tracking-wider uppercase">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Comprehensive Resume & Official Credentials
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Formatted in accordance with DepEd and private institutional academic standards. Available for digital review, PDF export, and verified reference contact.
          </p>

          {/* Action Toolbar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF (Clean Layout)</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-2 shadow-xs"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? 'Downloaded!' : 'Download JSON Data'}</span>
            </button>

            <button
              onClick={handleCopyPlainText}
              className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copiedPlainText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlainText ? 'Copied to Clipboard' : 'Copy Plain Text'}</span>
            </button>
          </div>
        </div>

        {/* Printable Resume Sheet Canvas */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-lg p-8 sm:p-12 space-y-10 print-page text-stone-900 dark:text-stone-100">
          
          {/* Resume Header */}
          <div className="border-b-2 border-amber-600 pb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-950 dark:text-white uppercase tracking-tight">
                {data.name}
              </h1>
              <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                {data.professionalTitle}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-300 italic">
                {data.subtitle}
              </p>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1 sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{data.socialLinks.location}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{data.socialLinks.phone}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{data.socialLinks.email}</span>
              </div>
            </div>
          </div>

          {/* Profile Statement */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1">
              Professional Profile
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed text-justify">
              {data.bio}
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.workExperience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs sm:text-sm">
                    <span className="font-bold text-stone-900 dark:text-stone-100">{exp.role}</span>
                    <span className="font-semibold text-stone-500 dark:text-stone-400">{exp.period}</span>
                  </div>
                  <div className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    {exp.institution}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1">
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-1">
                  <div className="font-bold text-stone-900 dark:text-stone-100">{edu.degree}</div>
                  <div className="text-stone-600 dark:text-stone-300">{edu.institution} ({edu.period})</div>
                  {edu.honors && <div className="text-amber-700 dark:text-amber-400 font-semibold">{edu.honors}</div>}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1">
                Research Capstone
              </h2>
              <div className="text-xs space-y-1">
                <div className="font-bold text-stone-900 dark:text-stone-100">"{data.researchTitle}"</div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  {data.researchAbstract}
                </p>
              </div>
            </div>
          </div>

          {/* Official References */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1">
              Character & Professional References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-xs space-y-1">
                  <div className="font-bold text-stone-900 dark:text-stone-100">{ref.name}</div>
                  <div className="text-stone-600 dark:text-stone-300 font-medium">{ref.title}</div>
                  <div className="text-stone-500 dark:text-stone-400 text-[11px]">{ref.institution}</div>
                  <div className="pt-1 flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                    <Phone className="w-3 h-3" />
                    <span>{ref.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff Verification Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>I hereby certify that all information provided above is true and verified.</span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">Reiner Joseph B. Oliveros, LPT</span>
          </div>

        </div>

      </div>
    </section>
  );
};
