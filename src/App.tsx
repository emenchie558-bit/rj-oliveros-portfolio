import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types/portfolio';
import { getPortfolioData } from './utils/storage';
import { checkAuthToken, logout } from './utils/security';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { AboutSection } from './components/public/AboutSection';
import { ProjectShowcase } from './components/public/ProjectShowcase';
import { ExperienceSection } from './components/public/ExperienceSection';
import { SkillsSection } from './components/public/SkillsSection';
import { LeadershipSection } from './components/public/LeadershipSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { ResumeSection } from './components/public/ResumeSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Global Data State
  const [data, setData] = useState<PortfolioData>(getPortfolioData());
  
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Routing State: 'public' | 'admin'
  const [route, setRoute] = useState<'public' | 'admin'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path.includes('/admin') || hash === '#admin' ? 'admin' : 'public';
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthToken());

  // Active section for header highlighting
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Synchronize browser history / URL path
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdm = path.includes('/admin') || hash === '#admin';
      setRoute(isAdm ? 'admin' : 'public');
      setIsAuthenticated(checkAuthToken());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Scroll spy for active section
  useEffect(() => {
    if (route !== 'public') return;

    const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'leadership', 'testimonials', 'resume', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [route]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navigateToAdmin = () => {
    setRoute('admin');
    window.history.pushState({}, '', '/admin');
  };

  const navigateToPublic = () => {
    setRoute('public');
    window.history.pushState({}, '', '/');
  };

  const handleAdminLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigateToPublic();
  };

  // Render Admin View
  if (route === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAuthenticated(true)}
          onBackToPortfolio={navigateToPublic}
        />
      );
    }

    return (
      <AdminDashboard
        portfolioData={data}
        onUpdatePortfolio={(updated) => setData(updated)}
        onBackToPortfolio={navigateToPublic}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Render Public Portfolio View
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-200">
      
      {/* Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAdmin={navigateToAdmin}
        activeSection={activeSection}
      />

      <main>
        {/* Hero Section */}
        <Hero
          data={data}
          onOpenResume={() => {
            const el = document.getElementById('resume');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAdmin={navigateToAdmin}
        />

        {/* Profile & Biography Section */}
        <AboutSection data={data} />

        {/* Work Experience Section */}
        <ExperienceSection experience={data.workExperience} />

        {/* Project Showcase Gallery */}
        <ProjectShowcase projects={data.projects} />

        {/* Core Skills & Methodologies Section */}
        <SkillsSection skills={data.skills} />

        {/* Leadership & Affiliations Section */}
        <LeadershipSection leadership={data.leadership} />

        {/* Colleague Testimonials & Endorsements */}
        <TestimonialsSection testimonials={data.testimonials} />

        {/* Downloadable / Printable Resume CV Section */}
        <ResumeSection data={data} />

        {/* Client Inquiry & Automated Gmail Trigger Contact Form */}
        <ContactSection data={data} />
      </main>

      {/* Footer with direct links to both Public Portfolio and Admin Website */}
      <Footer
        data={data}
        onOpenAdmin={navigateToAdmin}
      />

    </div>
  );
}
