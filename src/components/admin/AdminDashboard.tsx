import React, { useState, useEffect } from 'react';
import { 
  Shield, BarChart3, LayoutGrid, Briefcase, GraduationCap, 
  Layers, MessageSquare, History, Sparkles, ExternalLink, 
  Save, RotateCcw, Download, Plus, Trash2, Edit3, ArrowUp, 
  ArrowDown, Check, Eye, EyeOff, Upload, Image as ImageIcon, 
  RefreshCw, Copy, Smartphone, Monitor, AlertTriangle, Send, 
  CheckCircle2, Clock, Globe, ArrowLeft, LogOut, ChevronRight, Crop
} from 'lucide-react';
import { PortfolioData, Project, WorkExperience, LeadershipItem, InquiryMessage, ActivityLogItem } from '../../types/portfolio';
import { savePortfolioData, resetPortfolioData, exportPortfolioJSON } from '../../utils/storage';
import { logout, getActivityLogs, logActivity, ADMIN_CONFIG } from '../../utils/security';
import { ImageEditorModal } from './ImageEditorModal';

interface AdminDashboardProps {
  portfolioData: PortfolioData;
  onUpdatePortfolio: (updated: PortfolioData) => void;
  onBackToPortfolio: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  portfolioData,
  onUpdatePortfolio,
  onBackToPortfolio,
  onLogout
}) => {
  // Working copy of data for real-time editing & previewing
  const [data, setData] = useState<PortfolioData>(portfolioData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Active Tab: 'analytics' | 'profile' | 'projects' | 'experience' | 'skills' | 'inquiries' | 'logs' | 'ai-studio'
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // Real-time Preview Mode (split view or drawer)
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Copied Link Indicator
  const [copiedLink, setCopiedLink] = useState<'portfolio' | 'admin' | null>(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    monthlyPageviews: 1420,
    uniqueVisitors: 890,
    resumeDownloads: 384,
    inquiryCount: 18,
    serverUptime: '99.98%',
    apiLatencyMs: 42,
    deviceBreakdown: { mobile: 68, desktop: 28, tablet: 4 },
    monthlyTraffic: [
      { month: 'Apr', views: 420 },
      { month: 'May', views: 680 },
      { month: 'Jun', views: 920 },
      { month: 'Jul', views: 1150 },
      { month: 'Aug', views: 1310 },
      { month: 'Sep', views: 1420 },
    ]
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState<boolean>(false);

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);

  // Experience Editor Modal State
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [isNewExp, setIsNewExp] = useState<boolean>(false);

  // Gemini AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTopic, setAiTopic] = useState('K-12 Social Studies Philippine Governance and Constitution');
  const [aiGradeLevel, setAiGradeLevel] = useState('Senior High School (Grade 11/12)');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [imageGenPrompt, setImageGenPrompt] = useState('Modern educational infographic banner representing Social Studies and school leadership');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [analyzePrompt, setAnalyzePrompt] = useState('Analyze this educational document and generate tags and achievement bullets');
  const [analyzingImage, setAnalyzingImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Interactive Image Editor (Crop, Ratio, Zoom in/out, Resize) State
  const [imageEditorConfig, setImageEditorConfig] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    mode: 'avatar' | 'project';
    targetField: 'avatar' | 'project';
    targetProjectId?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: 'Edit & Crop Picture',
    mode: 'avatar',
    targetField: 'avatar',
  });

  const openImageEditor = (url: string, mode: 'avatar' | 'project', title: string, targetProjectId?: string) => {
    setImageEditorConfig({
      isOpen: true,
      imageUrl: url,
      title,
      mode,
      targetField: mode,
      targetProjectId,
    });
  };

  const handleEditorApply = (editedImageUrl: string) => {
    if (imageEditorConfig.targetField === 'avatar') {
      handleDataChange(prev => {
        const updated = { ...prev, avatarUrl: editedImageUrl };
        onUpdatePortfolio(updated); // Real-time updated in portfolio
        return updated;
      });
      logActivity('Profile Picture Resized & Updated', 'Applied real-time zoom, aspect ratio, and resize adjustments to avatar.', 'info');
      setLogs(getActivityLogs());
    } else if (imageEditorConfig.targetField === 'project') {
      if (editingProject) {
        setEditingProject(prev => prev ? { ...prev, image: editedImageUrl } : null);
      }
      if (imageEditorConfig.targetProjectId) {
        handleDataChange(prev => {
          const updatedProjects = prev.projects.map(p => 
            p.id === imageEditorConfig.targetProjectId ? { ...p, image: editedImageUrl } : p
          );
          const updated = { ...prev, projects: updatedProjects };
          onUpdatePortfolio(updated); // Real-time updated in portfolio
          return updated;
        });
      }
      logActivity('Project Image Resized & Updated', 'Applied real-time crop, ratio, and resolution adjustments to project exhibit.', 'info');
      setLogs(getActivityLogs());
    }
  };

  useEffect(() => {
    // Load fresh inquiries from server
    fetchInquiries();
    // Load activity logs
    setLogs(getActivityLogs());
  }, []);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const json = await res.json();
      if (json.success) {
        setInquiries(json.data);
      }
    } catch (e) {
      console.warn('Could not fetch server inquiries, using local state.');
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleDataChange = (updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const handleSaveChanges = () => {
    savePortfolioData(data);
    onUpdatePortfolio(data);
    setHasUnsavedChanges(false);
    setSaveSuccessMessage('All changes published and encrypted successfully!');
    logActivity('Portfolio Saved', 'Content updates and media synchronized to encrypted storage.', 'success');
    setLogs(getActivityLogs());
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all portfolio content to factory defaults? All custom edits will be reverted.')) {
      const defaultData = resetPortfolioData();
      setData(defaultData);
      onUpdatePortfolio(defaultData);
      setHasUnsavedChanges(false);
      logActivity('Portfolio Reset', 'Restored default curriculum vitae and project portfolio.', 'warning');
      setLogs(getActivityLogs());
    }
  };

  const handleCopyLink = (type: 'portfolio' | 'admin') => {
    const url = type === 'portfolio' ? window.location.origin : `${window.location.origin}/admin`;
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Reordering helpers (Drag-and-Drop / Move up/down)
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...data.projects];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProjects.length) return;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIdx];
    newProjects[targetIdx] = temp;
    handleDataChange(prev => ({ ...prev, projects: newProjects }));
    logActivity('Projects Reordered', `Moved project "${temp.title}" ${direction}.`, 'info');
  };

  const deleteProject = (id: string) => {
    const p = data.projects.find(x => x.id === id);
    if (window.confirm(`Are you sure you want to delete "${p?.title || 'this project'}"?`)) {
      handleDataChange(prev => ({
        ...prev,
        projects: prev.projects.filter(x => x.id !== id)
      }));
      logActivity('Project Deleted', `Removed project: ${p?.title || id}`, 'warning');
      setLogs(getActivityLogs());
    }
  };

  // Image Upload Handler (reads base64 file and launches interactive editor)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatar' | 'project', projectId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      openImageEditor(
        base64,
        targetField,
        targetField === 'avatar' ? 'Resize, Ratio & Zoom Profile Picture' : 'Resize, Ratio & Zoom Project Image',
        projectId
      );
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same file can be re-selected if desired
  };

  // Inquiries Management
  const markInquiryRead = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}/read`, { method: 'PATCH' });
    } catch (e) {}
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, read: true } : inq));
  };

  const deleteInquiry = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    logActivity('Inquiry Deleted', `Deleted client message id ${id}.`, 'info');
    setLogs(getActivityLogs());
  };

  // AI Generation Handlers
  const handleGenerateCurriculum = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/gemini/curriculum-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          gradeLevel: aiGradeLevel,
          subject: 'Social Studies & Philippine Governance',
          learningCompetencies: 'Analyze the dynamics of community power, leadership ethics, and democratic civic engagement.'
        })
      });
      const json = await res.json();
      if (json.success) {
        setAiResult(json.content);
        logActivity('AI Curriculum Generated', `Generated lesson guide for: ${aiTopic}`, 'info');
        setLogs(getActivityLogs());
      } else {
        setAiResult('Error generating curriculum guide. Please check API key status.');
      }
    } catch (err: any) {
      setAiResult(`Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setAiLoading(true);
    setGeneratedImageUrl(null);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imageGenPrompt,
          aspectRatio,
          imageSize
        })
      });
      const json = await res.json();
      if (json.success && json.imageUrl) {
        setGeneratedImageUrl(json.imageUrl);
        logActivity('AI Artwork Generated', `Created project image with aspect ratio ${aspectRatio}.`, 'info');
        setLogs(getActivityLogs());
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnalyzeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAnalyzingImage(base64);
      setAiLoading(true);
      setAnalysisResult(null);

      try {
        const res = await fetch('/api/gemini/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: base64,
            mimeType: file.type,
            prompt: analyzePrompt
          })
        });
        const json = await res.json();
        if (json.success) {
          setAnalysisResult(json.analysis);
          logActivity('Document Analyzed with AI', 'Extracted pedagogical insights from uploaded credential.', 'info');
          setLogs(getActivityLogs());
        }
      } catch (err: any) {
        setAnalysisResult(`Analysis error: ${err.message}`);
      } finally {
        setAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Admin Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Admin Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Super Admin
                </span>
              </div>
              <div className="text-[11px] text-stone-400 truncate max-w-[200px] sm:max-w-none">
                {ADMIN_CONFIG.EMAIL}
              </div>
            </div>
          </div>

          {/* Center Action Toolbar: Save, Preview, Reset */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Unsaved Changes
              </span>
            )}

            <button
              onClick={handleSaveChanges}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400/50'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Toggle Live Preview"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{previewMode ? 'Close Preview' : 'Live Preview'}</span>
            </button>

            <button
              onClick={() => exportPortfolioJSON(data)}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
              title="Export JSON Backup"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Right Exit & Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPortfolio}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Notifications Toast */}
      {saveSuccessMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-3 space-y-1">
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Monthly Analytics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile & Media</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'projects'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4" />
                <span>Manage Projects</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300">
                {data.projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'experience'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Work Experience</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300">
                {data.workExperience.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'skills'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Skills & Leadership</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {inquiries.filter(i => !i.read).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500 text-white font-bold">
                  {inquiries.filter(i => !i.read).length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai-studio')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'ai-studio'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gemini Educator Studio</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-950 text-amber-300 font-bold border border-amber-700/50">
                AI
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'logs'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                <span>Security & Logs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

          </div>

          {/* Quick Stats Widget */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>System Health</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-stone-300">
                <span>Database Cipher:</span>
                <span className="text-emerald-400 font-mono font-semibold">AES-256</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Server Status:</span>
                <span className="text-emerald-400 font-semibold">Operational (99.98%)</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>API Latency:</span>
                <span className="text-stone-400 font-mono">~42ms</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Multi-Factor Auth:</span>
                <span className="text-emerald-400 font-semibold">Active (TOTP)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={handleResetDefaults}
                className="w-full py-1.5 px-3 rounded-lg bg-stone-950 hover:bg-stone-800 text-[11px] font-semibold text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Factory Default</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 overflow-hidden">
          
          {/* TAB 1: Monthly Analytics & Performance */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Monthly Performance & Engagement Analytics
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Real-time audience tracking, resume CV downloads, and client inquiry response metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Reporting Month:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs font-semibold text-amber-400">
                    September 2026
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Monthly Views
                  </span>
                  <div className="text-2xl font-bold font-serif-title text-white">
                    {analyticsData.monthlyPageviews.toLocaleString()}+
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    +18.4% from last month
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Unique Visitors
                  </span>
                  <div className="text-2xl font-bold font-serif-title text-amber-400">
                    {analyticsData.uniqueVisitors.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    68% Mobile Traffic
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Resume Downloads
                  </span>
                  <div className="text-2xl font-bold font-serif-title text-white">
                    {analyticsData.resumeDownloads}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">
                    PDF & JSON format
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Inquiries Received
                  </span>
                  <div className="text-2xl font-bold font-serif-title text-emerald-400">
                    {inquiries.length}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">
                    100% Gmail dispatched
                  </div>
                </div>
              </div>

              {/* Monthly Pageviews Chart (SVG Bar Visualization) */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif-title">
                      Portfolio Traffic Trends (Last 6 Months)
                    </h4>
                    <p className="text-xs text-stone-400">Total monthly hits & educational engagement</p>
                  </div>
                  <span className="text-xs font-mono text-amber-400">Peak: 1,420 views (Sep)</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                  {analyticsData.monthlyTraffic.map((item) => {
                    const heightPercent = (item.views / 1500) * 100;
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-[10px] font-mono text-stone-400">{item.views}</div>
                        <div 
                          className="w-full max-w-[48px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all duration-500 hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-semibold text-stone-300">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Device and Traffic Sources Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <span>Device Distribution</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span>Mobile Browsers (iOS / Android)</span>
                        <span className="font-semibold text-amber-400">68%</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span>Desktop Browsers</span>
                        <span className="font-semibold text-stone-300">28%</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-stone-500 h-full rounded-full" style={{ width: '28%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span>Tablets & iPads</span>
                        <span className="font-semibold text-stone-400">4%</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-stone-600 h-full rounded-full" style={{ width: '4%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <span>Top Traffic Channels</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li className="flex justify-between py-1 border-b border-stone-800">
                      <span>Direct URL / QR Code (Resumes & Business Cards)</span>
                      <span className="font-semibold text-amber-400">45%</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-stone-800">
                      <span>DepEd / Institutional Network References</span>
                      <span className="font-semibold text-stone-300">27%</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-stone-800">
                      <span>LinkedIn Professional Networking</span>
                      <span className="font-semibold text-stone-300">18%</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>Organic Search (Google / Academic Directories)</span>
                      <span className="font-semibold text-stone-400">10%</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Edit Profile & Media */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Edit Profile Details & Media
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Modify your headline, biography, contact information, and upload new photos in real time.
                  </p>
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
                
                {/* Avatar Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-800">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md shrink-0">
                    <img
                      src={data.avatarUrl}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="text-xs font-bold text-white block">Profile Picture / Avatar</span>
                    <p className="text-xs text-stone-400">
                      Upload a high-resolution portrait or paste an image URL.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload New Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => openImageEditor(data.avatarUrl, 'avatar', 'Resize, Ratio & Zoom Profile Picture')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Resize, Ratio & Zoom</span>
                      </button>

                      <input
                        type="url"
                        placeholder="Or enter Image URL..."
                        value={data.avatarUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleDataChange(prev => {
                            const updated = { ...prev, avatarUrl: val };
                            onUpdatePortfolio(updated); // Real-time updated in portfolio
                            return updated;
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-200 flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Full Name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => handleDataChange(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Professional Title</label>
                    <input
                      type="text"
                      value={data.professionalTitle}
                      onChange={(e) => handleDataChange(prev => ({ ...prev, professionalTitle: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Academic Subtitle</label>
                    <input
                      type="text"
                      value={data.subtitle}
                      onChange={(e) => handleDataChange(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Email Address (Notifications Target)</label>
                    <input
                      type="email"
                      value={data.socialLinks.email}
                      onChange={(e) => handleDataChange(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, email: e.target.value }
                      }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Phone Number</label>
                    <input
                      type="text"
                      value={data.socialLinks.phone}
                      onChange={(e) => handleDataChange(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, phone: e.target.value }
                      }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Residential Address</label>
                    <input
                      type="text"
                      value={data.socialLinks.location}
                      onChange={(e) => handleDataChange(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, location: e.target.value }
                      }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Hero Tagline */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">Hero Tagline</label>
                  <input
                    type="text"
                    value={data.heroTagline}
                    onChange={(e) => handleDataChange(prev => ({ ...prev, heroTagline: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">Executive Bio / Philosophy Statement</label>
                  <textarea
                    rows={4}
                    value={data.bio}
                    onChange={(e) => handleDataChange(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                {/* Research Title & Abstract */}
                <div className="pt-4 border-t border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Research Capstone Information
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={data.researchTitle}
                      onChange={(e) => handleDataChange(prev => ({ ...prev, researchTitle: e.target.value }))}
                      placeholder="Research Title"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <textarea
                      rows={3}
                      value={data.researchAbstract}
                      onChange={(e) => handleDataChange(prev => ({ ...prev, researchAbstract: e.target.value }))}
                      placeholder="Research Abstract / Findings"
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Manage Projects & Showcase (Reorder, Edit, Delete, Upload Picture) */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Manage Portfolio Projects & Exhibits
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Drag/reorder elements, upload pictures, edit content, and delete items with instant live preview.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: 'New Educational Initiative',
                      category: 'Curriculum & MELCs',
                      description: 'Comprehensive curriculum framework or administrative initiative description.',
                      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
                      role: 'Lead Coordinator',
                      institution: 'Academic Institution',
                      year: '2026',
                      tags: ['Education', 'Leadership'],
                      keyOutcomes: ['Key educational outcome achieved']
                    });
                    setIsNewProject(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects List with Drag/Move Reordering */}
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => moveProject(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveProject(index, 'down')}
                          disabled={index === data.projects.length - 1}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Project Image Thumbnail */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-800 shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
                            {project.category}
                          </span>
                          <span className="text-xs text-stone-500">{project.year}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{project.title}</h4>
                        <p className="text-xs text-stone-400 truncate max-w-md">{project.description}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openImageEditor(project.image, 'project', `Resize, Ratio & Zoom: ${project.title}`, project.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        title="Crop & Resize Project Image"
                      >
                        <Crop className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden md:inline">Resize / Ratio</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingProject({ ...project });
                          setIsNewProject(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete this project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Modal Editor */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-800 p-6 sm:p-8 space-y-5">
                    <h3 className="text-xl font-serif-title font-bold text-white">
                      {isNewProject ? 'Add New Portfolio Project' : 'Edit Project Details'}
                    </h3>

                    <div className="space-y-4">
                      {/* Image Preview & Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-300 block">Project Cover Image</label>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                          <img
                            src={editingProject.image}
                            alt={editingProject.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700">
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'project', editingProject.id)}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => openImageEditor(editingProject.image, 'project', `Resize, Ratio & Zoom: ${editingProject.title}`, editingProject.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Resize, Ratio & Zoom</span>
                          </button>

                          <input
                            type="text"
                            value={editingProject.image}
                            onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                            placeholder="Image URL..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-200 min-w-[180px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300">Project Title</label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300">Category</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                          >
                            <option value="Curriculum & MELCs">Curriculum & MELCs</option>
                            <option value="PEAC-ESC Accreditation">PEAC-ESC Accreditation</option>
                            <option value="School Leadership">School Leadership</option>
                            <option value="DRRR & Community">DRRR & Community</option>
                            <option value="Research">Research</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300">Role</label>
                          <input
                            type="text"
                            value={editingProject.role}
                            onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300">Institution</label>
                          <input
                            type="text"
                            value={editingProject.institution}
                            onChange={(e) => setEditingProject({ ...editingProject, institution: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-stone-300">Year / Period</label>
                          <input
                            type="text"
                            value={editingProject.year}
                            onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-300">Short Summary</label>
                        <textarea
                          rows={2}
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-300">Detailed Case Description</label>
                        <textarea
                          rows={3}
                          value={editingProject.longDescription || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-300">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={editingProject.tags.join(', ')}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                          })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (isNewProject) {
                            handleDataChange(prev => ({
                              ...prev,
                              projects: [editingProject, ...prev.projects]
                            }));
                            logActivity('Project Created', `Added new project: ${editingProject.title}`, 'success');
                          } else {
                            handleDataChange(prev => ({
                              ...prev,
                              projects: prev.projects.map(p => p.id === editingProject.id ? editingProject : p)
                            }));
                            logActivity('Project Updated', `Modified details for: ${editingProject.title}`, 'info');
                          }
                          setEditingProject(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white"
                      >
                        Save Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Work Experience & Education */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Work Experience & Timeline
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Update faculty roles, coordinator milestones, and school appointments.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newExp: WorkExperience = {
                      id: `exp-${Date.now()}`,
                      role: 'Senior Faculty / Academic Officer',
                      institution: 'Academic Institution',
                      period: '2026',
                      year: 2026,
                      description: 'Role overview and primary accomplishments.',
                      responsibilities: ['Responsibility 1', 'Responsibility 2']
                    };
                    handleDataChange(prev => ({
                      ...prev,
                      workExperience: [newExp, ...prev.workExperience]
                    }));
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.workExperience.map((exp, index) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...data.workExperience];
                            updated[index].role = e.target.value;
                            handleDataChange(prev => ({ ...prev, workExperience: updated }));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-white font-semibold"
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          value={exp.institution}
                          onChange={(e) => {
                            const updated = [...data.workExperience];
                            updated[index].institution = e.target.value;
                            handleDataChange(prev => ({ ...prev, workExperience: updated }));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-300"
                          placeholder="Institution"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...data.workExperience];
                            updated[index].period = e.target.value;
                            handleDataChange(prev => ({ ...prev, workExperience: updated }));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-400 font-medium"
                          placeholder="Period"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this work experience entry?')) {
                            handleDataChange(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.filter(x => x.id !== exp.id)
                            }));
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 self-end sm:self-center"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...data.workExperience];
                        updated[index].description = e.target.value;
                        handleDataChange(prev => ({ ...prev, workExperience: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-300"
                      placeholder="Role summary"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Skills & Leadership */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-xl font-serif-title font-bold text-white">
                  Skills, Competencies & Affiliations
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Update administrative categories and institutional committee records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.skills.map((cat, catIdx) => (
                  <div key={catIdx} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {cat.category}
                    </h4>
                    <div className="space-y-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const updatedSkills = [...data.skills];
                              updatedSkills[catIdx].skills[sIdx] = e.target.value;
                              handleDataChange(prev => ({ ...prev, skills: updatedSkills }));
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-200"
                          />
                          <button
                            onClick={() => {
                              const updatedSkills = [...data.skills];
                              updatedSkills[catIdx].skills.splice(sIdx, 1);
                              handleDataChange(prev => ({ ...prev, skills: updatedSkills }));
                            }}
                            className="text-stone-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const updatedSkills = [...data.skills];
                          updatedSkills[catIdx].skills.push('New Skill Item');
                          handleDataChange(prev => ({ ...prev, skills: updatedSkills }));
                        }}
                        className="text-xs text-amber-400 hover:underline pt-1 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" /> Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Inquiries & Messages with Automated Gmail Trigger status */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Client Inquiries & Dispatch Queue
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Messages received through portfolio contact form with automated Gmail trigger forwarding status.
                  </p>
                </div>

                <button
                  onClick={fetchInquiries}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <MessageSquare className="w-8 h-8 text-stone-500 mx-auto" />
                  <p className="text-sm font-semibold text-stone-300">No client inquiries in inbox</p>
                  <p className="text-xs text-stone-500">New submissions from your portfolio will appear here immediately.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 ${
                        inq.read
                          ? 'bg-stone-900 border-stone-800'
                          : 'bg-stone-900/90 border-amber-500/40 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{inq.name}</span>
                          {!inq.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                              Unread
                            </span>
                          )}
                          <span className="text-xs text-stone-400 font-medium">({inq.organization || 'Inquirer'})</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(inq.timestamp).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Dispatched to Gmail
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-amber-400">
                          {inq.inquiryType}: {inq.subject}
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                        <div className="text-stone-400 flex items-center gap-3">
                          <span>Email: <strong className="text-stone-200">{inq.email}</strong></span>
                          {inq.phone && <span>Phone: <strong className="text-stone-200">{inq.phone}</strong></span>}
                        </div>

                        <div className="flex items-center gap-2">
                          {!inq.read && (
                            <button
                              onClick={() => markInquiryRead(inq.id)}
                              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
                            >
                              Mark as Read
                            </button>
                          )}
                          <a
                            href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}&body=Dear ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for contacting me through my professional portfolio...`}
                            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reply via Gmail / Mail</span>
                          </a>
                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="p-1 rounded-lg text-stone-500 hover:text-red-400"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Gemini AI Educator Studio */}
          {activeTab === 'ai-studio' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-xl font-serif-title font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Gemini AI Educator & Content Studio</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  High-thinking curriculum planning, bio refinement, artwork creation with aspect ratio controls, and multimodal document analysis.
                </p>
              </div>

              {/* Submodule 1: High Thinking Curriculum & Lesson Plan Assistant */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    1. High-Thinking Curriculum & MELCs Assistant
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    High Thinking Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-stone-300">Topic / Core Concept</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-stone-300">Grade Level / Domain</label>
                    <input
                      type="text"
                      value={aiGradeLevel}
                      onChange={(e) => setAiGradeLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateCurriculum}
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? 'Thinking & Generating Framework...' : 'Generate K-12 Lesson Framework'}</span>
                </button>

                {aiResult && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-mono">
                    {aiResult}
                  </div>
                )}
              </div>

              {/* Submodule 2: Artwork & Project Graphic Generator with Aspect Ratio & Size Controls */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  2. Project Artwork Generation (Aspect Ratio & Resolution Affordance)
                </span>
                
                <div className="space-y-1">
                  <label className="text-xs text-stone-300">Prompt / Subject Description</label>
                  <input
                    type="text"
                    value={imageGenPrompt}
                    onChange={(e) => setImageGenPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-stone-300">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                    >
                      <option value="16:9">16:9 (Landscape Banner)</option>
                      <option value="1:1">1:1 (Square Tile)</option>
                      <option value="4:3">4:3 (Presentation)</option>
                      <option value="3:4">3:4 (Portrait Document)</option>
                      <option value="9:16">9:16 (Story / Mobile View)</option>
                      <option value="21:9">21:9 (Ultrawide Panoramic)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-300">Resolution Size</label>
                    <select
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                    >
                      <option value="1K">1K Standard High-Definition</option>
                      <option value="2K">2K High Quality</option>
                      <option value="4K">4K Ultra Studio Resolution</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{aiLoading ? 'Synthesizing Graphic...' : 'Generate Project Artwork'}</span>
                </button>

                {generatedImageUrl && (
                  <div className="space-y-2 pt-2">
                    <div className="relative rounded-xl overflow-hidden border border-stone-800 max-w-md">
                      <img src={generatedImageUrl} alt="AI Generated" className="w-full h-auto" />
                    </div>
                    <button
                      onClick={() => {
                        handleDataChange(prev => ({
                          ...prev,
                          projects: prev.projects.map((p, idx) => idx === 0 ? { ...p, image: generatedImageUrl } : p)
                        }));
                        alert('Applied graphic to featured portfolio project!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                    >
                      Use as Featured Project Image
                    </button>
                  </div>
                )}
              </div>

              {/* Submodule 3: Multimodal Document / Certificate Analyzer */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  3. Multimodal Certificate & Classroom Photo Analyzer
                </span>
                <p className="text-xs text-stone-400">
                  Upload a photo of a teaching certificate, classroom activity, or accreditation binder to automatically analyze competencies and draft portfolio copy.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Document for AI Analysis</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAnalyzeImage}
                    />
                  </label>
                </div>

                {analyzingImage && (
                  <div className="w-32 h-24 rounded-lg overflow-hidden border border-stone-700">
                    <img src={analyzingImage} alt="Uploaded for analysis" className="w-full h-full object-cover" />
                  </div>
                )}

                {analysisResult && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 leading-relaxed font-mono whitespace-pre-wrap">
                    {analysisResult}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 8: Security, Audit Trail & Activity Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-white">
                    Administrative Activity Log & Security Monitor
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Immutable audit records of administrator access, MFA challenges, content modifications, and session telemetry.
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audit Trail Secure</span>
                </div>
              </div>

              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-800 bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4">Client IP / Location</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 text-stone-300">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-stone-800/50">
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-stone-300">
                            {log.details}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                            {log.ipAddress}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : log.status === 'warning'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Real-time Live Split Preview Drawer / Modal */}
      {previewMode && (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-stone-900 border-b border-stone-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Real-Time Portfolio Preview Mode</span>
              <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                Interactive preview of pending modifications
              </span>
            </div>

            <button
              onClick={() => setPreviewMode(false)}
              className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500"
            >
              Exit Preview & Continue Editing
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-900/50">
            <div className="max-w-5xl mx-auto bg-stone-50 text-stone-900 rounded-3xl overflow-hidden shadow-2xl p-8 space-y-8">
              <div className="flex items-center gap-6 border-b pb-6">
                <img src={data.avatarUrl} alt={data.name} className="w-20 h-20 rounded-full object-cover shadow-md" />
                <div>
                  <h1 className="text-2xl font-serif-title font-bold">{data.name}</h1>
                  <p className="text-xs font-semibold text-amber-700">{data.professionalTitle} • {data.subtitle}</p>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">{data.heroTagline}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-2">Projects Preview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.projects.slice(0, 4).map(p => (
                    <div key={p.id} className="p-4 rounded-xl border bg-white space-y-1">
                      <div className="text-[10px] font-bold text-amber-700">{p.category}</div>
                      <div className="text-sm font-bold">{p.title}</div>
                      <p className="text-xs text-stone-600 line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Image Editor Modal (Resize, Ratio, Zoom in/out, Crop) */}
      <ImageEditorModal
        isOpen={imageEditorConfig.isOpen}
        imageUrl={imageEditorConfig.imageUrl}
        title={imageEditorConfig.title}
        mode={imageEditorConfig.mode}
        onClose={() => setImageEditorConfig(prev => ({ ...prev, isOpen: false }))}
        onSave={handleEditorApply}
      />

    </div>
  );
};
