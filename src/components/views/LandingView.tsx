import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Globe, 
  MapPin, 
  Bot, 
  Compass, 
  Activity, 
  Cpu, 
  FileCheck,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Trash2,
  Lightbulb,
  Waves,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CivicCategory } from '../../types';

export const LandingView: React.FC = () => {
  const { setCurrentView, language, setLanguage, t, startNewIssueWithCategory } = useApp();

  const categories: Array<{ id: CivicCategory; icon: any; title: string; desc: string; color: string; bg: string }> = [
    { id: 'road_damage', icon: AlertTriangle, title: t.categories.road_damage.title, desc: t.categories.road_damage.desc, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { id: 'water_leakage', icon: Droplets, title: t.categories.water_leakage.title, desc: t.categories.water_leakage.desc, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { id: 'sanitation', icon: Trash2, title: t.categories.sanitation.title, desc: t.categories.sanitation.desc, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { id: 'streetlights', icon: Lightbulb, title: t.categories.streetlights.title, desc: t.categories.streetlights.desc, color: 'text-yellow-300', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    { id: 'drainage', icon: Waves, title: t.categories.drainage.title, desc: t.categories.drainage.desc, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { id: 'other', icon: HelpCircle, title: t.categories.other.title, desc: t.categories.other.desc, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-[#EAF3FF] font-sans selection:bg-[#00C8FF]/20 selection:text-[#00C8FF] overflow-x-hidden">
      {/* PUBLIC NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#06142B]/80 backdrop-blur-md border-b border-[#164A80]/70 px-4 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#246BFD] via-[#7028FF] to-[#00C8FF] p-0.5 shadow-[0_0_20px_rgba(0,200,255,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#06142B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00C8FF] animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-[#EAF3FF] to-[#00C8FF] bg-clip-text text-transparent">
              SAHAAYA AI
            </span>
            <div className="text-[10px] text-[#8EA9CF] tracking-wide">
              {t.brand.tagline}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[#8EA9CF]">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#categories" className="hover:text-white transition">Domains</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#ethics" className="hover:text-white transition">AI Ethics</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#071B38] border border-[#164A80] rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white'
                  : 'text-[#8EA9CF] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-full transition ${
                language === 'ta'
                  ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white'
                  : 'text-[#8EA9CF] hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#246BFD] to-[#7028FF] hover:opacity-95 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(36,107,253,0.4)] transition flex items-center gap-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 px-4 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#246BFD]/20 via-[#7028FF]/20 to-[#00C8FF]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071B38] border border-[#00C8FF]/40 text-xs font-semibold text-[#00C8FF] mb-6 shadow-[0_0_15px_rgba(0,200,255,0.2)]">
          <Bot className="w-3.5 h-3.5" />
          <span>Next-Generation Civic Intelligence Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Every Problem. <br />
          <span className="bg-gradient-to-r from-[#00C8FF] via-[#246BFD] to-[#7028FF] bg-clip-text text-transparent">
            A Clearer Next Step.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-[#8EA9CF] max-w-2xl mb-10 leading-relaxed font-normal">
          Empowering citizens to report potholes, water leaks, garbage dumps, and dark streets in natural language. SAHAAYA AI validates data, formats formal municipal complaints, and tracks progress.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={() => setCurrentView('newIssue')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] text-black font-extrabold text-sm hover:shadow-[0_0_25px_rgba(0,200,255,0.5)] transition flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Report a Problem Now</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#164A80] text-sm font-semibold text-[#EAF3FF] transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#00C8FF]" />
            <span>Open Civic Dashboard</span>
          </button>
        </div>

        {/* Metrics Banner */}
        <div className="w-full max-w-5xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#071B38]/80 border border-[#164A80]/70 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00C8FF] font-mono">1,420+</div>
            <div className="text-xs text-[#8EA9CF] font-medium mt-1">Community Issues Routed</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#071B38]/80 border border-[#164A80]/70 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#16D6B0] font-mono">96.4%</div>
            <div className="text-xs text-[#8EA9CF] font-medium mt-1">AI Triage Accuracy</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#071B38]/80 border border-[#164A80]/70 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFB547] font-mono">Tamil + EN</div>
            <div className="text-xs text-[#8EA9CF] font-medium mt-1">Bilingual Voice & Text</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#071B38]/80 border border-[#164A80]/70 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">100%</div>
            <div className="text-xs text-[#8EA9CF] font-medium mt-1">Open Grievance Audit</div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="features" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto border-t border-[#164A80]/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-2">
            Engineered For Municipal Impact
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Smart Features That Solve Real Street Problems
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF]/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00C8FF] mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Smart AI Guidance</h4>
            <p className="text-xs text-[#8EA9CF] leading-relaxed">
              Detects hazard severity, suggests missing landmarks, and identifies the exact municipal wing responsible for the repair.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF]/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Tamil & English Native</h4>
            <p className="text-xs text-[#8EA9CF] leading-relaxed">
              Full bilingual support. Citizens can speak or write in Tamil or English to generate properly drafted petitions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF]/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#16D6B0] mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Real-Time Tracking</h4>
            <p className="text-xs text-[#8EA9CF] leading-relaxed">
              Transparent status progression from initial verification to on-site work crew dispatch and repair confirmation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF]/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Geospatial Incident Map</h4>
            <p className="text-xs text-[#8EA9CF] leading-relaxed">
              Interactive Leaflet city map with real-time issue clustering, category filters, and pinpoint geolocation tagging.
            </p>
          </div>
        </div>
      </section>

      {/* SIX CIVIC ISSUE DOMAINS */}
      <section id="categories" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto border-t border-[#164A80]/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-2">
            Civic Domains Supported
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Common Public Infrastructure We Address
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => startNewIssueWithCategory(cat.id)}
                className="p-5 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF] hover:bg-[#0A2040] transition cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.bg}`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#164A80]/60 text-[#8EA9CF]">
                      Tap to Report
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#00C8FF] transition mb-1">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#8EA9CF] leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-[#00C8FF] group-hover:translate-x-1 transition gap-1">
                  <span>File grievance in this domain</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto border-t border-[#164A80]/60">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-2">
            Streamlined 4-Step Flow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Street Hazard to Municipal Action
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] relative">
            <span className="text-3xl font-extrabold font-mono text-[#00C8FF]/30">01</span>
            <h4 className="text-base font-bold text-white mt-2 mb-2">Describe Problem</h4>
            <p className="text-xs text-[#8EA9CF]">
              Type or speak in Tamil or English. Add optional photos and tag your street location.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] relative">
            <span className="text-3xl font-extrabold font-mono text-[#246BFD]/30">02</span>
            <h4 className="text-base font-bold text-white mt-2 mb-2">AI Validation</h4>
            <p className="text-xs text-[#8EA9CF]">
              SAHAAYA AI checks severity, missing landmarks, and maps it to the responsible department.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] relative">
            <span className="text-3xl font-extrabold font-mono text-[#7028FF]/30">03</span>
            <h4 className="text-base font-bold text-white mt-2 mb-2">Draft Generation</h4>
            <p className="text-xs text-[#8EA9CF]">
              Generates an editable, respectful municipal complaint letter ready for ward submission.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] relative">
            <span className="text-3xl font-extrabold font-mono text-[#16D6B0]/30">04</span>
            <h4 className="text-base font-bold text-white mt-2 mb-2">Live Tracking</h4>
            <p className="text-xs text-[#8EA9CF]">
              Track the complaint ticket with timestamps, assigned officers, and on-site repair progress.
            </p>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI & ETHICS BANNER */}
      <section id="ethics" className="py-16 px-4 lg:px-12 max-w-7xl mx-auto border-t border-[#164A80]/60">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#06142B] via-[#071B38] to-[#0A2040] border border-[#164A80] flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#00C8FF]/10 border border-[#00C8FF]/40 flex items-center justify-center shrink-0">
            <Shield className="w-8 h-8 text-[#00C8FF]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Responsible AI & Citizen Privacy Commitment
            </h3>
            <p className="text-xs text-[#8EA9CF] leading-relaxed">
              SAHAAYA AI acts as an advisory drafting assistant. We do not impersonate government officials, fabricate resolution promises, or sell citizen geolocation data. All complaints remain citizen-verified prior to official lodging.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white text-xs font-bold uppercase tracking-wider shrink-0 shadow-lg hover:opacity-95 transition"
          >
            Enter Platform
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#164A80]/80 bg-[#06142B] py-10 px-4 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8EA9CF]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">SAHAAYA AI</span>
            <span>•</span>
            <span>Every Problem. A Clearer Next Step.</span>
          </div>
          <div>Built for Civic Assistance • Tamil Nadu & Pan-India Municipal Support</div>
        </div>
      </footer>
    </div>
  );
};
