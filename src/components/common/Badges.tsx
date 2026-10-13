import React from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Waves, 
  HelpCircle 
} from 'lucide-react';
import { CivicCategory, ReportStatus, UrgencyLevel } from '../../types';
import { useApp } from '../../context/AppContext';

export const getCategoryConfig = (category: CivicCategory) => {
  switch (category) {
    case 'road_damage':
      return {
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        colorHex: '#F59E0B'
      };
    case 'water_leakage':
      return {
        icon: Droplets,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        glow: 'shadow-[0_0_15px_rgba(0,200,255,0.2)]',
        colorHex: '#00C8FF'
      };
    case 'sanitation':
      return {
        icon: Trash2,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        colorHex: '#10B981'
      };
    case 'streetlights':
      return {
        icon: Lightbulb,
        color: 'text-yellow-300',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        glow: 'shadow-[0_0_15px_rgba(253,224,71,0.2)]',
        colorHex: '#FDE047'
      };
    case 'drainage':
      return {
        icon: Waves,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        glow: 'shadow-[0_0_15px_rgba(129,140,248,0.2)]',
        colorHex: '#818CF8'
      };
    case 'other':
    default:
      return {
        icon: HelpCircle,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        colorHex: '#3B82F6'
      };
  }
};

export const CategoryBadge: React.FC<{
  category: CivicCategory;
  showIcon?: boolean;
  className?: string;
}> = ({ category, showIcon = true, className = '' }) => {
  const { t } = useApp();
  const config = getCategoryConfig(category);
  const Icon = config.icon;
  const label = t.categories[category]?.title || category;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{
  status: ReportStatus;
  className?: string;
}> = ({ status, className = '' }) => {
  const { t } = useApp();

  let styles = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  let pulseDot = 'bg-blue-400';

  switch (status) {
    case 'submitted':
      styles = 'bg-slate-500/15 text-slate-300 border-slate-500/30';
      pulseDot = 'bg-slate-400';
      break;
    case 'in_review':
      styles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      pulseDot = 'bg-amber-400 animate-pulse';
      break;
    case 'assigned':
      styles = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      pulseDot = 'bg-cyan-400 animate-pulse';
      break;
    case 'in_progress':
      styles = 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      pulseDot = 'bg-violet-400 animate-ping';
      break;
    case 'resolved':
      styles = 'bg-[#16D6B0]/15 text-[#16D6B0] border-[#16D6B0]/30 shadow-[0_0_12px_rgba(22,214,176,0.25)]';
      pulseDot = 'bg-[#16D6B0]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${pulseDot}`} />
      <span>{t.status[status] || status}</span>
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  const { t } = useApp();
  let color = 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  if (urgency === 'medium') color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (urgency === 'high') color = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  if (urgency === 'critical') color = 'text-rose-400 bg-rose-500/15 border-rose-500/30 animate-pulse';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wide ${color}`}>
      {t.urgency[urgency] || urgency}
    </span>
  );
};
