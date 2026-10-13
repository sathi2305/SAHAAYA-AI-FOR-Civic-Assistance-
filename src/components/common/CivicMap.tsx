import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicCategory, CivicReport } from '../../types';
import { getCategoryConfig } from './Badges';

interface CivicMapProps {
  reports: CivicReport[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onSelectReport?: (id: string) => void;
  interactive?: boolean;
  selectedId?: string | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  allowPinDrop?: boolean;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  reports,
  center = [13.0600, 80.2450],
  zoom = 12,
  height = '420px',
  onSelectReport,
  interactive = true,
  selectedId,
  onLocationSelect,
  allowPinDrop = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pinDropMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        attributionControl: false
      });

      // Standard OpenStreetMap tiles (100% free, no API key required, zero watermarks)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
      }).addTo(map);

      // Attribution control styled neatly
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Handle Pin Drop if enabled
      if (allowPinDrop && onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onLocationSelect(lat, lng);

          if (pinDropMarkerRef.current) {
            pinDropMarkerRef.current.setLatLng(e.latlng);
          } else {
            const dropIcon = L.divIcon({
              className: 'custom-drop-pin',
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></div>
                  <div class="w-6 h-6 rounded-full bg-[#00C8FF] border-2 border-white shadow-[0_0_15px_#00C8FF] flex items-center justify-center text-xs font-bold text-black">
                    📍
                  </div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            pinDropMarkerRef.current = L.marker([lat, lng], { icon: dropIcon }).addTo(map);
          }
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center if needed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    reports.forEach(report => {
      const config = getCategoryConfig(report.category);
      const isSelected = selectedId === report.id;
      const markerColor = config.colorHex;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125' : ''}">
          <div class="absolute w-7 h-7 rounded-full opacity-60 animate-pulse" style="background-color: ${markerColor}"></div>
          <div class="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${markerColor}">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'sahaaya-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 200px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${markerColor}; margin-bottom: 2px;">
            ${report.category.replace('_', ' ')} • ${report.status.toUpperCase()}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #EAF3FF; margin-bottom: 4px; line-height: 1.3;">
            ${report.title}
          </div>
          <div style="font-size: 11px; color: #8EA9CF; margin-bottom: 8px;">
            📍 ${report.ward || report.address}
          </div>
          <button id="btn-inspect-${report.id}" style="width: 100%; background: linear-gradient(135deg, #246BFD, #7028FF); color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Inspect Grievance Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'sahaaya-popup'
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${report.id}`);
        if (btn && onSelectReport) {
          btn.onclick = () => {
            onSelectReport(report.id);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectReport) {
          onSelectReport(report.id);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [reports, selectedId, onSelectReport]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#164A80]/70 shadow-2xl dark-tiles">
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="z-0"
      />
      {allowPinDrop && (
        <div className="absolute top-3 left-3 z-[1000] bg-[#071B38]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#00C8FF]/30 text-xs text-[#00C8FF] font-medium shadow-md flex items-center gap-2">
          <span>📍 Click on map to pinpoint issue location</span>
        </div>
      )}
    </div>
  );
};
