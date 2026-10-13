import React from 'react';
import { 
  PlusCircle, 
  ArrowRight, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Waves, 
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Compass,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CivicCategory } from '../../types';
import { CategoryBadge, StatusBadge, UrgencyBadge } from '../common/Badges';
import { CivicMap } from '../common/CivicMap';

export const DashboardView: React.FC = () => {
  const { 
    t, 
    setCurrentView, 
    reports, 
    startNewIssueWithCategory, 
    openReportDetails 
  } = useApp();

  const categories: Array<{ id: CivicCategory; title: string; desc: string; badge: string; icon: any; color: string; bg: string }> = [
    { 
      id: 'road_damage', 
      title: t.categories.road_damage.title, 
      desc: t.categories.road_damage.desc, 
      badge: t.categories.road_damage.badge,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    { 
      id: 'water_leakage', 
      title: t.categories.water_leakage.title, 
      desc: t.categories.water_leakage.desc, 
      badge: t.categories.water_leakage.badge,
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30'
    },
    { 
      id: 'sanitation', 
      title: t.categories.sanitation.title, 
      desc: t.categories.sanitation.desc, 
      badge: t.categories.sanitation.badge,
      icon: Trash2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    { 
      id: 'streetlights', 
      title: t.categories.streetlights.title, 
      desc: t.categories.streetlights.desc, 
      badge: t.categories.streetlights.badge,
      icon: Lightbulb,
      color: 'text-yellow-300',
      bg: 'bg-yellow-500/10 border-yellow-500/30'
    },
    { 
      id: 'drainage', 
      title: t.categories.drainage.title, 
      desc: t.categories.drainage.desc, 
      badge: t.categories.drainage.badge,
      icon: Waves,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30'
    },
    { 
      id: 'other', 
      title: t.categories.other.title, 
      desc: t.categories.other.desc, 
      badge: t.categories.other.badge,
      icon: HelpCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30'
    },
  ];

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* GREETING & CONTEXT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.dashboard.greeting}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C8FF]/15 border border-[#00C8FF]/30 text-[#00C8FF] text-xs font-semibold">
              {t.dashboard.wardBadge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8EA9CF]">
            {t.dashboard.taglineCommunity}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setCurrentView('newIssue')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,200,255,0.3)] transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>{t.dashboard.reportNewIssue}</span>
        </button>
      </div>

      {/* LARGE CITY-THEMED REPORTING HERO BANNER (Matches reference image) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#071B38] via-[#0A2040] to-[#071B38] border border-[#164A80] overflow-hidden shadow-2xl">
        {/* Glow & geometric city lights */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#7028FF]/20 via-[#246BFD]/15 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#00C8FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C8FF]/15 border border-[#00C8FF]/30 text-xs font-bold text-[#00C8FF] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Grievance System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
            {t.dashboard.heroTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#8EA9CF] leading-relaxed mb-6">
            {t.dashboard.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('newIssue')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#246BFD] to-[#7028FF] hover:shadow-[0_0_20px_rgba(36,107,253,0.4)] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dashboard.reportNewIssue}</span>
            </button>

            <button
              onClick={() => setCurrentView('mapView')}
              className="px-4 py-2.5 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#164A80] text-xs font-semibold text-[#EAF3FF] transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#00C8FF]" />
              <span>{t.dashboard.viewFullMap}</span>
            </button>

            <button
              onClick={() => setCurrentView('communityImpact')}
              className="px-4 py-2.5 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#164A80] text-xs font-semibold text-[#16D6B0] transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-[#16D6B0]" />
              <span>Community Impact</span>
            </button>
          </div>
        </div>

        {/* Decorative mini grid representation in corner */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-[#06142B]/80 border border-[#164A80]/70 backdrop-blur-md text-xs w-64 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#164A80]/50 mb-2">
            <span className="font-bold text-[#00C8FF] text-[11px]">Metropolitan Hotspots</span>
            <span className="w-2 h-2 rounded-full bg-[#16D6B0] animate-ping" />
          </div>
          <div className="space-y-1.5 text-[11px] text-[#8EA9CF]">
            <div className="flex justify-between">
              <span>Anna Nagar Zone 8</span>
              <span className="text-amber-300 font-mono">3 Active</span>
            </div>
            <div className="flex justify-between">
              <span>T. Nagar Zone 10</span>
              <span className="text-cyan-300 font-mono">5 Active</span>
            </div>
            <div className="flex justify-between">
              <span>Adyar Zone 13</span>
              <span className="text-emerald-300 font-mono">2 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIX CIVIC ISSUE CATEGORY CARDS (Grid as in reference image) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Issue Categories
            </h3>
            <p className="text-xs text-[#8EA9CF]">
              Select a domain to start a pre-classified complaint draft
            </p>
          </div>
          <span className="text-xs text-[#00C8FF] font-semibold">
            6 Civic Domains
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            // Count matching reports
            const count = reports.filter(r => r.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => startNewIssueWithCategory(cat.id)}
                className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF] hover:bg-[#0A2040] transition duration-200 cursor-pointer group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg}`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#164A80]/50 text-[#8EA9CF]">
                      {count} Logged
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-[#00C8FF] transition mb-1">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#8EA9CF] leading-relaxed mb-3 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#164A80]/40 flex items-center justify-between text-[11px]">
                  <span className="text-[#00C8FF] font-medium flex items-center gap-1">
                    <span>File Report</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                  </span>
                  <span className="text-[#8EA9CF] text-[10px]">{cat.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT REPORTS TABLE (Matches reference image) */}
      <div className="p-5 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#164A80]/60 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.dashboard.recentReports}
            </h3>
            <p className="text-xs text-[#8EA9CF]">
              Live status updates on citizen grievances
            </p>
          </div>
          <button
            onClick={() => setCurrentView('myReports')}
            className="text-xs font-bold text-[#00C8FF] hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewAllReports}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#164A80]/60 text-[#8EA9CF] uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Ticket ID</th>
                <th className="pb-3 font-semibold">Domain</th>
                <th className="pb-3 font-semibold">Incident Details</th>
                <th className="pb-3 font-semibold">Ward & Location</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#164A80]/40">
              {recentReports.map(report => (
                <tr 
                  key={report.id}
                  className="hover:bg-[#0A2040]/50 transition group cursor-pointer"
                  onClick={() => openReportDetails(report.id)}
                >
                  <td className="py-3.5 font-mono font-bold text-[#00C8FF]">
                    {report.id}
                  </td>
                  <td className="py-3.5">
                    <CategoryBadge category={report.category} />
                  </td>
                  <td className="py-3.5 max-w-xs pr-4">
                    <div className="font-semibold text-white truncate">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-[#8EA9CF] truncate">
                      {report.description}
                    </div>
                  </td>
                  <td className="py-3.5 text-[#8EA9CF]">
                    <div className="truncate max-w-[150px]">{report.ward}</div>
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openReportDetails(report.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#246BFD]/20 hover:bg-[#246BFD]/30 border border-[#246BFD]/40 text-[#00C8FF] text-[11px] font-medium transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ISSUE LOCATIONS MAP (Matches reference image) */}
      <div className="p-5 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#164A80]/60 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t.dashboard.recentLocations}
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#16D6B0] animate-pulse" />
            </div>
            <p className="text-xs text-[#8EA9CF]">
              Geospatial dispersion of reported hazards across active zones
            </p>
          </div>
          <button
            onClick={() => setCurrentView('mapView')}
            className="text-xs font-bold text-[#00C8FF] hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewFullMap}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Container */}
        <CivicMap
          reports={reports}
          height="340px"
          onSelectReport={openReportDetails}
        />
      </div>
    </div>
  );
};
