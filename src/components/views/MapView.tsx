import React, { useState } from 'react';
import { 
  MapPin, 
  Filter, 
  Compass, 
  Layers, 
  ChevronRight, 
  Calendar, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CivicCategory, CivicReport } from '../../types';
import { CivicMap } from '../common/CivicMap';
import { CategoryBadge, StatusBadge, UrgencyBadge } from '../common/Badges';

export const MapView: React.FC = () => {
  const { t, reports, openReportDetails, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0600, 80.2450]);
  const [mapZoom, setMapZoom] = useState<number>(12);

  const categories: Array<{ id: string; label: string; color: string }> = [
    { id: 'all', label: t.map.allFilters, color: '#00C8FF' },
    { id: 'road_damage', label: t.categories.road_damage.title, color: '#F59E0B' },
    { id: 'water_leakage', label: t.categories.water_leakage.title, color: '#00C8FF' },
    { id: 'sanitation', label: t.categories.sanitation.title, color: '#10B981' },
    { id: 'streetlights', label: t.categories.streetlights.title, color: '#FDE047' },
    { id: 'drainage', label: t.categories.drainage.title, color: '#818CF8' },
    { id: 'other', label: t.categories.other.title, color: '#3B82F6' },
  ];

  const filteredReports = activeCategory === 'all'
    ? reports
    : reports.filter(r => r.category === activeCategory);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      addToast('error', 'Geolocation not supported by browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(15);
        addToast('success', 'Centered map on your current location.');
      },
      () => {
        addToast('info', 'Location permission denied. Map remains centered on metropolitan zone.');
      }
    );
  };

  const handleMarkerSelect = (id: string) => {
    setSelectedReportId(id);
    const target = reports.find(r => r.id === id);
    if (target) {
      setMapCenter([target.latitude, target.longitude]);
      setMapZoom(15);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {t.map.title}
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16D6B0] animate-ping" />
          </div>
          <p className="text-xs sm:text-sm text-[#8EA9CF]">
            {t.map.subtitle}
          </p>
        </div>

        <button
          onClick={handleLocateMe}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#071B38] hover:bg-[#0A2040] border border-[#00C8FF]/40 text-xs font-semibold text-[#00C8FF] transition flex items-center gap-2 shadow-md"
        >
          <Compass className="w-4 h-4 text-[#00C8FF]" />
          <span>{t.map.locateMe}</span>
        </button>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white border-transparent shadow-[0_0_12px_rgba(36,107,253,0.3)] font-semibold'
                  : 'bg-[#071B38] text-[#8EA9CF] border-[#164A80] hover:text-white hover:bg-[#0A2040]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAP + SIDEBAR DETAIL DOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEAFLET MAP */}
        <div className="lg:col-span-2">
          <CivicMap
            reports={filteredReports}
            center={mapCenter}
            zoom={mapZoom}
            height="550px"
            onSelectReport={handleMarkerSelect}
            selectedId={selectedReportId}
          />
        </div>

        {/* DETAILS DOCK & LEGEND */}
        <div className="space-y-4">
          {/* Selected marker detail card */}
          {selectedReport ? (
            <div className="p-5 rounded-2xl bg-[#071B38] border border-[#00C8FF]/50 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#164A80]/60">
                <span className="font-mono text-xs font-bold text-[#00C8FF]">
                  {selectedReport.id}
                </span>
                <StatusBadge status={selectedReport.status} />
              </div>

              <div>
                <CategoryBadge category={selectedReport.category} className="mb-2" />
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {selectedReport.title}
                </h3>
                <p className="text-xs text-[#8EA9CF] leading-relaxed line-clamp-3">
                  {selectedReport.description}
                </p>
              </div>

              <div className="text-xs text-[#8EA9CF] space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00C8FF]" />
                  <span>{selectedReport.ward || selectedReport.address}</span>
                </div>
                {selectedReport.department && (
                  <div className="text-[11px] text-cyan-300">
                    Jurisdiction: {selectedReport.department}
                  </div>
                )}
              </div>

              <button
                onClick={() => openReportDetails(selectedReport.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span>Inspect Grievance Letter & Status</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#00C8FF]/60 mx-auto" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Select Any Marker
              </h4>
              <p className="text-xs text-[#8EA9CF]">
                {t.map.clickToInspect}
              </p>
            </div>
          )}

          {/* COLOR LEGEND */}
          <div className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.map.legend}
            </h4>
            <div className="space-y-2 text-xs text-[#8EA9CF]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Road Damage & Potholes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Water Supply Leaks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span>Solid Waste & Sanitation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-300" />
                <span>Streetlights & Darkness</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-400" />
                <span>Storm Drain & Sewerage</span>
              </div>
            </div>
          </div>

          {/* ACTIVE COUNTS */}
          <div className="p-4 rounded-2xl bg-[#071B38] border border-[#164A80] flex items-center justify-between text-xs">
            <span className="text-[#8EA9CF]">{t.map.activeMarkers}</span>
            <span className="font-bold text-[#00C8FF] font-mono text-sm">
              {filteredReports.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
