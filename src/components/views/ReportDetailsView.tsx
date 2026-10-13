import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Bot, 
  Copy, 
  Download, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Building2, 
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge, StatusBadge, UrgencyBadge } from '../common/Badges';
import { CivicMap } from '../common/CivicMap';
import { ReportStatus } from '../../types';

export const ReportDetailsView: React.FC = () => {
  const { 
    t, 
    reports, 
    selectedReportId, 
    setCurrentView, 
    updateReportStatus, 
    deleteReport, 
    addToast 
  } = useApp();

  const report = reports.find(r => r.id === selectedReportId) || reports[0];

  const [draftContent, setDraftContent] = useState<string>(report?.complaintDraft || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!report) {
    return (
      <div className="p-8 text-center text-[#8EA9CF]">
        <p>No report selected.</p>
        <button
          onClick={() => setCurrentView('myReports')}
          className="mt-3 px-4 py-2 rounded-xl bg-[#246BFD] text-white text-xs font-semibold"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(draftContent);
    setIsCopied(true);
    addToast('success', 'Complaint letter copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([draftContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}-complaint-draft.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Downloaded complaint text file.');
  };

  const handleStatusChange = (newStatus: ReportStatus) => {
    updateReportStatus(report.id, newStatus);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => setCurrentView('myReports')}
          className="flex items-center gap-2 text-xs font-semibold text-[#8EA9CF] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => deleteReport(report.id)}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-xs font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete Report</span>
          </button>
        </div>
      </div>

      {/* MAIN REPORT CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071B38] border border-[#164A80] shadow-2xl space-y-6">
        {/* Header Tags & Title */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-extrabold text-sm text-[#00C8FF] bg-[#00C8FF]/10 px-2.5 py-1 rounded-lg border border-[#00C8FF]/30">
              {report.id}
            </span>
            <CategoryBadge category={report.category} />
            <StatusBadge status={report.status} />
            {report.urgency && <UrgencyBadge urgency={report.urgency} />}
            {report.isDemo && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Hackathon Demo Record
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8EA9CF]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>{report.ward} • {report.address}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8EA9CF]" />
              <span>Filed: {new Date(report.createdAt).toLocaleString('en-IN')}</span>
            </span>
            {report.department && (
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Building2 className="w-3.5 h-3.5" />
                <span>{report.department}</span>
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-[#0A2040]/70 border border-[#164A80]/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8EA9CF] mb-1.5">
            Citizen Grievance Description
          </h3>
          <p className="text-xs sm:text-sm text-[#EAF3FF] leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* AI SUMMARY BOX */}
        {report.aiSummary && (
          <div className="p-4 rounded-2xl bg-[#06142B] border border-[#00C8FF]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00C8FF] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#00C8FF]" />
              <span>SAHAAYA AI Technical Summary</span>
            </div>
            <p className="text-xs text-[#EAF3FF] leading-relaxed">
              {report.aiSummary}
            </p>
          </div>
        )}

        {/* EVIDENCE PHOTO (IF ANY) */}
        {report.evidenceUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8EA9CF]">
              Photographic Evidence Attached
            </h3>
            <div className="rounded-2xl overflow-hidden border border-[#164A80] max-h-80 bg-black/50 flex justify-center">
              <img
                src={report.evidenceUrl}
                alt="Evidence"
                className="max-h-80 object-contain"
              />
            </div>
          </div>
        )}

        {/* MINI MAP LOCATION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8EA9CF]">
              Location Radar & Coordinates
            </h3>
            <span className="text-[11px] font-mono text-[#00C8FF]">
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </span>
          </div>
          <CivicMap
            reports={[report]}
            center={[report.latitude, report.longitude]}
            zoom={15}
            height="220px"
            selectedId={report.id}
          />
        </div>

        {/* MUNICIPAL COMPLAINT LETTER (EDITABLE) */}
        <div className="space-y-3 pt-4 border-t border-[#164A80]/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Official Municipal Grievance Letter
              </h3>
              <p className="text-xs text-[#8EA9CF]">
                Pre-formatted petition ready for GCC, BBMP, or local municipal offices.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#0A2040] hover:bg-[#164A80] text-xs font-semibold text-[#00C8FF] transition flex items-center gap-1.5"
              >
                {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#16D6B0]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Letter'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-[#0A2040] hover:bg-[#164A80] text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#06142B] border border-[#164A80] font-mono text-xs text-[#EAF3FF] focus:outline-none focus:border-[#00C8FF] transition leading-relaxed resize-y"
          />
        </div>

        {/* SIMULATE WARD STATUS PROGRESSION (Interactive Demo Feature) */}
        <div className="p-5 rounded-2xl bg-[#06142B] border border-[#246BFD]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Simulate Ward Resolution Workflow
            </span>
            <span className="text-[10px] text-[#00C8FF] font-semibold">Interactive Demo Control</span>
          </div>
          <p className="text-xs text-[#8EA9CF]">
            Test how SAHAAYA AI updates event logs as municipal field officers take action:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(['submitted', 'in_review', 'assigned', 'in_progress', 'resolved'] as ReportStatus[]).map(st => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  report.status === st
                    ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white border-transparent shadow-[0_0_12px_rgba(36,107,253,0.4)]'
                    : 'bg-[#071B38] text-[#8EA9CF] border-[#164A80] hover:text-white'
                }`}
              >
                {t.status[st] || st}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE OF EVENTS */}
        <div className="space-y-4 pt-4 border-t border-[#164A80]/70">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Resolution Event History
          </h3>

          <div className="space-y-3 pl-2">
            {report.timeline?.map((ev, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#0A2040] border border-[#00C8FF] text-[#00C8FF] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ev.title}</span>
                    <span className="text-[10px] text-[#8EA9CF]">
                      {new Date(ev.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#8EA9CF] mt-0.5">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
