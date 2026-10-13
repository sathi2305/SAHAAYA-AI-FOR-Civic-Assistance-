import React, { useState } from 'react';
import { 
  Globe, 
  Bell, 
  Shield, 
  Trash2, 
  Download, 
  Moon, 
  Check, 
  User, 
  HelpCircle,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { t, language, setLanguage, reports, addToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(false);

  const handleClearCache = () => {
    localStorage.removeItem('sahaaya_language');
    addToast('success', t.settings.clearSuccess);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sahaaya-reports-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Grievance reports exported successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          {t.settings.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#8EA9CF]">
          {t.settings.subtitle}
        </p>
      </div>

      {/* LANGUAGE PREFERENCE */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#246BFD]/15 border border-[#246BFD]/30 flex items-center justify-center text-[#00C8FF]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {t.settings.languageHeading}
            </h2>
            <p className="text-xs text-[#8EA9CF]">
              {t.settings.languageDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setLanguage('en');
              addToast('info', 'Language switched to English');
            }}
            className={`p-4 rounded-xl border flex items-center justify-between text-left transition ${
              language === 'en'
                ? 'bg-[#0A2040] border-[#00C8FF] text-white shadow-[0_0_15px_rgba(0,200,255,0.2)]'
                : 'bg-[#0A2040]/40 border-[#164A80]/60 text-[#8EA9CF] hover:text-white'
            }`}
          >
            <div>
              <div className="font-bold text-sm">English (Default)</div>
              <div className="text-[11px] text-[#8EA9CF]">Municipal forms & interface in English</div>
            </div>
            {language === 'en' && <Check className="w-4 h-4 text-[#00C8FF]" />}
          </button>

          <button
            onClick={() => {
              setLanguage('ta');
              addToast('info', 'மொழி தமிழில் மாற்றப்பட்டது');
            }}
            className={`p-4 rounded-xl border flex items-center justify-between text-left transition ${
              language === 'ta'
                ? 'bg-[#0A2040] border-[#00C8FF] text-white shadow-[0_0_15px_rgba(0,200,255,0.2)]'
                : 'bg-[#0A2040]/40 border-[#164A80]/60 text-[#8EA9CF] hover:text-white'
            }`}
          >
            <div>
              <div className="font-bold text-sm">தமிழ் (Tamil)</div>
              <div className="text-[11px] text-[#8EA9CF]">முழு இடைமுகம் மற்றும் மனுக்கள் தமிழில்</div>
            </div>
            {language === 'ta' && <Check className="w-4 h-4 text-[#00C8FF]" />}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7028FF]/15 border border-[#7028FF]/30 flex items-center justify-center text-violet-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {t.settings.notificationsHeading}
            </h2>
            <p className="text-xs text-[#8EA9CF]">
              Configure municipal resolution updates and dispatch notifications.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A2040]/50 border border-[#164A80]/70 cursor-pointer">
            <span className="text-xs text-[#EAF3FF] font-medium">
              {t.settings.emailAlerts}
            </span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#246BFD] focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A2040]/50 border border-[#164A80]/70 cursor-pointer">
            <span className="text-xs text-[#EAF3FF] font-medium">
              {t.settings.smsAlerts}
            </span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-[#246BFD] focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* CITIZEN PROFILE */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16D6B0]/15 border border-[#16D6B0]/30 flex items-center justify-center text-[#16D6B0]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Citizen Profile & Jurisdictional Ward
            </h2>
            <p className="text-xs text-[#8EA9CF]">
              Profile information associated with generated municipal complaints.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-[#8EA9CF] uppercase mb-1">
              Petitioner Name
            </label>
            <input
              type="text"
              readOnly
              value="Praveen Kumar"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8EA9CF] uppercase mb-1">
              Residential Zone
            </label>
            <input
              type="text"
              readOnly
              value="Zone 10 (Kodambakkam / T. Nagar)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0A2040] border border-[#164A80] text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* PRIVACY, DATA & EXPORT */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00C8FF]/15 border border-[#00C8FF]/30 flex items-center justify-center text-[#00C8FF]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {t.settings.privacyHeading}
            </h2>
            <p className="text-xs text-[#8EA9CF]">
              {t.settings.privacyNotice}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-[#0A2040] hover:bg-[#164A80] text-xs font-semibold text-white border border-[#164A80] transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#00C8FF]" />
            <span>Export All Reports (JSON)</span>
          </button>

          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.clearData}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
