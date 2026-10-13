import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Trash2, 
  FileText, 
  PlusCircle, 
  Sparkles, 
  ArrowUpDown, 
  RefreshCw,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CivicCategory, ReportStatus } from '../../types';
import { CategoryBadge, StatusBadge, UrgencyBadge } from '../common/Badges';

export const MyReportsView: React.FC = () => {
  const { 
    t, 
    reports, 
    loadingReports, 
    fetchReports, 
    openReportDetails, 
    deleteReport, 
    setCurrentView,
    searchFocusTrigger
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus and select search input on global Ctrl+K trigger or view entry
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [searchFocusTrigger]);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: t.reports.allCategories },
    { id: 'road_damage', label: t.categories.road_damage.title },
    { id: 'water_leakage', label: t.categories.water_leakage.title },
    { id: 'sanitation', label: t.categories.sanitation.title },
    { id: 'streetlights', label: t.categories.streetlights.title },
    { id: 'drainage', label: t.categories.drainage.title },
    { id: 'other', label: t.categories.other.title },
  ];

  const statuses: Array<{ id: string; label: string }> = [
    { id: 'all', label: t.reports.allStatuses },
    { id: 'submitted', label: t.status.submitted },
    { id: 'in_review', label: t.status.in_review },
    { id: 'assigned', label: t.status.assigned },
    { id: 'in_progress', label: t.status.in_progress },
    { id: 'resolved', label: t.status.resolved },
  ];

  // Filtering
  const filtered = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting
  filtered.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.reports.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#8EA9CF]">
            {t.reports.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchReports()}
            disabled={loadingReports}
            className="p-2.5 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#164A80] text-[#8EA9CF] hover:text-white transition"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${loadingReports ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setCurrentView('newIssue')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,200,255,0.3)] hover:opacity-95 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>New Grievance</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80] space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA9CF]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (searchTerm) {
                    setSearchTerm('');
                  } else {
                    searchInputRef.current?.blur();
                  }
                }
              }}
              placeholder={t.reports.searchPlaceholder}
              className="w-full pl-10 pr-24 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white placeholder-[#8EA9CF]/60 focus:outline-none focus:border-[#00C8FF] focus:ring-1 focus:ring-[#00C8FF]/40 transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-md text-[#8EA9CF] hover:text-white transition cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#06142B] border border-[#164A80] text-[10px] font-mono text-[#00C8FF]">
                  Ctrl+K
                </kbd>
              )}
            </div>
          </div>

          {/* Category Select */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white focus:outline-none focus:border-[#00C8FF] transition"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-[#071B38]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="w-full md:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white focus:outline-none focus:border-[#00C8FF] transition"
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id} className="bg-[#071B38]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
            className="w-full md:w-auto px-3 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-[#8EA9CF] hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>

        {/* Results tally */}
        <div className="flex items-center justify-between text-[11px] text-[#8EA9CF] pt-1">
          <span>Showing {filtered.length} of {reports.length} records</span>
          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="text-[#00C8FF] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* REPORTS LIST */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#071B38] border border-[#164A80] text-center space-y-3 shadow-xl">
          <FileText className="w-10 h-10 text-[#8EA9CF]/50 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {t.reports.noReportsFound}
          </h3>
          <p className="text-xs text-[#8EA9CF]">
            Try adjusting your search keywords or resetting category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(report => (
            <div
              key={report.id}
              onClick={() => openReportDetails(report.id)}
              className="p-5 rounded-2xl bg-[#071B38] border border-[#164A80] hover:border-[#00C8FF]/70 hover:bg-[#0A2040]/70 transition duration-200 cursor-pointer shadow-lg group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#00C8FF]">
                    {report.id}
                  </span>
                  <CategoryBadge category={report.category} />
                  <StatusBadge status={report.status} />
                  {report.urgency && <UrgencyBadge urgency={report.urgency} />}
                  {report.isDemo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Sample Data
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#00C8FF] transition">
                  {report.title}
                </h3>

                <p className="text-xs text-[#8EA9CF] line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8EA9CF] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00C8FF]" />
                    <span>{report.ward || report.address}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8EA9CF]" />
                    <span>{new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteReport(report.id);
                  }}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                  title={t.reports.deleteReport}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openReportDetails(report.id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#246BFD]/20 hover:bg-[#246BFD]/30 border border-[#246BFD]/50 text-xs font-semibold text-[#EAF3FF] flex items-center gap-1.5 transition"
                >
                  <span>{t.reports.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00C8FF]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
