import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusCircle, 
  FileText, 
  Bot, 
  MapPin, 
  Settings, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  UploadCloud, 
  Search,
  Sparkles,
  Layers,
  Compass,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { 
    currentView, 
    setCurrentView, 
    language, 
    setLanguage, 
    t, 
    reports, 
    activeAiStatus,
    openReportDetails,
    addToast,
    triggerSearchFocus
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K to focus search on My Reports)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        triggerSearchFocus();
        addToast('info', 'Focused search bar (Ctrl+K)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSearchFocus, addToast]);

  const navItems: Array<{ id: AppView; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'newIssue', label: t.nav.newIssue, icon: PlusCircle },
    { id: 'myReports', label: t.nav.myReports, icon: FileText },
    { id: 'communityImpact', label: t.nav.communityImpact || 'Community Impact', icon: BarChart3 },
    { id: 'aiAssistant', label: t.nav.aiAssistant, icon: Bot },
    { id: 'mapView', label: t.nav.mapView, icon: MapPin },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const handleNav = (id: AppView) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
  };

  const isPublicLanding = currentView === 'landing';

  // If in landing view, show dedicated landing navigation or seamless switch
  if (isPublicLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#020817] text-[#EAF3FF] flex flex-col font-sans selection:bg-[#00C8FF]/20 selection:text-[#00C8FF]">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#06142B]/90 backdrop-blur-md border-b border-[#164A80]/70 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#8EA9CF] hover:text-white hover:bg-[#071B38]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#246BFD] via-[#7028FF] to-[#00C8FF] p-0.5 shadow-[0_0_15px_rgba(0,200,255,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#06142B] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#00C8FF] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-[#EAF3FF] to-[#00C8FF] bg-clip-text text-transparent">
                  SAHAAYA AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30">
                  CIVIC v2.0
                </span>
              </div>
              <p className="text-[10px] text-[#8EA9CF] tracking-wide -mt-0.5 hidden sm:block">
                {t.brand.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Ward Indicator & Quick Search */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={triggerSearchFocus}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#164A80] hover:border-[#00C8FF]/50 text-xs text-[#8EA9CF] hover:text-white transition group cursor-pointer"
            title="Search Grievance Reports (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span className="text-[11px] font-medium hidden lg:inline">Search reports...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#06142B] border border-[#164A80] text-[10px] font-mono text-[#00C8FF] group-hover:border-[#00C8FF]/40">
              Ctrl+K
            </kbd>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#071B38] border border-[#164A80] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#16D6B0] animate-ping" />
            <span className="text-[#8EA9CF] hidden xl:inline">Active Jurisdiction:</span>
            <span className="text-white font-medium">Zone 10 (T.Nagar)</span>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* AI Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A2040] border border-[#00C8FF]/30 text-[11px] text-[#00C8FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
            <span className="font-semibold">{activeAiStatus.configured ? 'Gemini 3.8 Live' : 'Sahaaya Engine Active'}</span>
          </div>

          {/* Language Toggle Pill */}
          <div className="flex items-center bg-[#071B38] border border-[#164A80] rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white shadow-md'
                  : 'text-[#8EA9CF] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full transition ${
                language === 'ta'
                  ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white shadow-md'
                  : 'text-[#8EA9CF] hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-xl bg-[#071B38] border border-[#164A80] text-[#8EA9CF] hover:text-white hover:border-[#00C8FF]/50 transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00C8FF] rounded-full animate-ping" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#071B38] border border-[#164A80] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#164A80]/60 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Civic Notifications</span>
                  <span className="text-[10px] text-[#00C8FF]">3 New Updates</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#0A2040]/70 border border-[#164A80]">
                    <div className="text-white font-medium">Road Repair Mobilized</div>
                    <div className="text-[#8EA9CF] text-[11px]">Asphalt crew dispatched to Anna Nagar 2nd Ave (SHY-2025-0104).</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0A2040]/70 border border-[#164A80]">
                    <div className="text-white font-medium">Water Pipeline Leak Under Review</div>
                    <div className="text-[#8EA9CF] text-[11px]">CMWSSB ticket generated for Usman Road.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#164A80]/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#246BFD] to-[#00C8FF] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#06142B] rounded-full flex items-center justify-center font-bold text-xs text-[#00C8FF]">
                PK
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Praveen Kumar</div>
              <div className="text-[10px] text-[#8EA9CF] leading-tight">Resident Activist</div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT + RIGHT PANEL (ON DASHBOARD) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden lg:flex w-64 bg-[#06142B] border-r border-[#164A80]/70 flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8EA9CF]/80 px-3">
              Navigation
            </div>
            <nav className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white shadow-[0_0_20px_rgba(36,107,253,0.35)] font-semibold'
                        : 'text-[#8EA9CF] hover:text-white hover:bg-[#071B38] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8EA9CF]'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'myReports' && !isActive && (
                      <kbd className="px-1.5 py-0.5 rounded bg-[#071B38] border border-[#164A80] text-[9px] font-mono text-[#8EA9CF]">
                        ^K
                      </kbd>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] shadow-[0_0_8px_#00C8FF]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Action Button in Sidebar */}
            <div className="pt-4 border-t border-[#164A80]/60">
              <button
                onClick={() => handleNav('newIssue')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-[0_0_20px_rgba(0,200,255,0.3)] transition"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>+ Report Grievance</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 rounded-xl bg-[#071B38] border border-[#164A80]/60 text-xs">
            <div className="flex items-center gap-1.5 text-[#00C8FF] font-semibold text-[11px] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Civic Guard Protocol</span>
            </div>
            <p className="text-[10px] text-[#8EA9CF] leading-relaxed">
              Every complaint is categorized & formatted for official municipal accountability.
            </p>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-[#06142B] border-r border-[#164A80] p-4 flex flex-col justify-between h-full z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#164A80]">
                  <span className="font-bold text-sm text-[#00C8FF]">SAHAAYA AI</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-[#8EA9CF]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white font-semibold'
                            : 'text-[#8EA9CF] hover:text-white hover:bg-[#071B38]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-7 min-w-0">
          {children}
        </main>

        {/* RIGHT UTILITY COLUMN (Visible on Dashboard to mirror reference image) */}
        {currentView === 'dashboard' && (
          <aside className="hidden xl:flex w-80 bg-[#06142B] border-l border-[#164A80]/70 flex-col p-5 gap-5 shrink-0 overflow-y-auto">
            {/* Live AI Assistant Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#071B38] to-[#0A2040] border border-[#164A80] relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#7028FF]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#246BFD] to-[#7028FF] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {t.dashboard.aiAssistantCardTitle}
                  </h4>
                  <span className="text-[10px] text-[#00C8FF] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
                    Online & Ready
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#8EA9CF] mb-3 leading-relaxed">
                {t.dashboard.aiAssistantCardDesc}
              </p>
              <button
                onClick={() => setCurrentView('aiAssistant')}
                className="w-full py-2 px-3 rounded-xl bg-[#246BFD]/20 hover:bg-[#246BFD]/30 border border-[#246BFD]/50 text-xs font-semibold text-[#EAF3FF] flex items-center justify-center gap-1.5 transition"
              >
                <span>{t.dashboard.askSahaaya}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#00C8FF]" />
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80]/80">
              <h4 className="text-xs font-bold text-[#EAF3FF] uppercase tracking-wider mb-3">
                {t.dashboard.quickActions}
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('newIssue')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A2040] hover:bg-[#0A2040]/80 border border-[#164A80]/60 text-xs font-medium text-[#EAF3FF] transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <UploadCloud className="w-4 h-4 text-[#00C8FF]" />
                    <span>{t.dashboard.uploadEvidence}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8EA9CF] group-hover:text-white transition" />
                </button>

                <button
                  onClick={() => setCurrentView('myReports')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A2040] hover:bg-[#0A2040]/80 border border-[#164A80]/60 text-xs font-medium text-[#EAF3FF] transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#16D6B0]" />
                    <span>{t.dashboard.trackReport}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8EA9CF] group-hover:text-white transition" />
                </button>

                <button
                  onClick={() => setCurrentView('mapView')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A2040] hover:bg-[#0A2040]/80 border border-[#164A80]/60 text-xs font-medium text-[#EAF3FF] transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#FFB547]" />
                    <span>{t.dashboard.viewOnMap}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8EA9CF] group-hover:text-white transition" />
                </button>

                <button
                  onClick={() => setCurrentView('communityImpact')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A2040] hover:bg-[#0A2040]/80 border border-[#164A80]/60 text-xs font-medium text-[#EAF3FF] transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-[#16D6B0]" />
                    <span>Community Impact</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8EA9CF] group-hover:text-white transition" />
                </button>
              </div>
            </div>

            {/* Subtle Voice & Civic Radar Graphic Card */}
            <div className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80]/70 flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                <div className="absolute inset-0 rounded-full bg-[#00C8FF]/10 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#246BFD] to-[#7028FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,200,255,0.3)]">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <h5 className="text-xs font-bold text-white mb-1">
                Bilingual Civic Support
              </h5>
              <p className="text-[11px] text-[#8EA9CF] mb-3">
                {t.dashboard.voiceAssistPrompt}
              </p>
              <div className="w-full flex justify-center gap-2 text-[10px] font-mono text-[#00C8FF]">
                <span className="px-2 py-0.5 rounded bg-[#00C8FF]/10 border border-[#00C8FF]/20">English</span>
                <span className="px-2 py-0.5 rounded bg-[#00C8FF]/10 border border-[#00C8FF]/20">தமிழ்</span>
              </div>
            </div>

            {/* Recent Quick Stats */}
            <div className="mt-auto pt-3 border-t border-[#164A80]/60 text-[11px] text-[#8EA9CF] flex justify-between items-center">
              <span>Jurisdiction Reports</span>
              <span className="font-bold text-[#00C8FF]">{reports.length} Logged</span>
            </div>
          </aside>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#06142B] border-t border-[#164A80]/70 px-4 lg:px-8 py-3 text-xs text-[#8EA9CF] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">SAHAAYA AI</span>
          <span>•</span>
          <span className="text-[11px]">{t.brand.tagline}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={() => setCurrentView('settings')} className="hover:text-white transition">Privacy & Ethics</button>
          <span>•</span>
          <button onClick={() => setCurrentView('settings')} className="hover:text-white transition">Municipal Terms</button>
          <span>•</span>
          <button onClick={() => setCurrentView('aiAssistant')} className="hover:text-white transition">Civic Helpdesk</button>
        </div>
      </footer>
    </div>
  );
};
