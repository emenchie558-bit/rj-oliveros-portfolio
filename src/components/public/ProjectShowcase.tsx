import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, Search, Tag, ExternalLink, Calendar, 
  Building2, CheckCircle2, ChevronRight, X, Sparkles, Filter
} from 'lucide-react';
import { Project } from '../../types/portfolio';

interface ProjectShowcaseProps {
  projects: Project[];
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'Curriculum & MELCs',
    'PEAC-ESC Accreditation',
    'School Leadership',
    'DRRR & Community',
    'Research'
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some(t => t.toLowerCase().includes(q)) ||
        project.institution.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wider uppercase">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Institutional & Educational Portfolio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Project Showcase & Academic Initiatives
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          Explore curated documentation of curriculum frameworks, accreditation compliance portfolios, youth governance programs, and emergency preparedness manuals.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search initiatives, tags, or MELCs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Count */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
          <span>Showing {filteredProjects.length} initiative{filteredProjects.length === 1 ? '' : 's'}</span>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
          <Filter className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">No matching projects found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switch category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white"
          >
            Show All Initiatives
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Project Image Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-900/80 text-white backdrop-blur-xs">
                      {project.category}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1 truncate max-w-[65%]">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{project.institution}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.year}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-serif-title font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Tags & Read more */}
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-medium text-stone-600 dark:text-stone-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-stone-400">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>View Case Overview</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Project Detail Modal */}
      {activeProject && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-stone-950">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-md">
                  {activeProject.category}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Role: {activeProject.role}
                  </span>
                  <span>•</span>
                  <span>{activeProject.institution}</span>
                  <span>•</span>
                  <span>{activeProject.year}</span>
                </div>
                <h3 id="project-modal-title" className="text-2xl font-serif-title font-bold text-stone-900 dark:text-stone-100">
                  {activeProject.title}
                </h3>
              </div>

              {/* Description */}
              <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed space-y-3">
                <p>{activeProject.longDescription || activeProject.description}</p>
              </div>

              {/* Key Outcomes */}
              {activeProject.keyOutcomes && activeProject.keyOutcomes.length > 0 && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Key Deliverables & Accreditation Impact</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {activeProject.keyOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block">Keywords & Competencies</span>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
