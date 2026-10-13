import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, AppView, CivicCategory, CivicReport } from '../types';
import { translations } from '../data/translations';

interface DraftIssue {
  category: CivicCategory;
  title: string;
  description: string;
  address: string;
  ward: string;
  latitude: number;
  longitude: number;
  evidenceUrl?: string;
  evidenceName?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: typeof translations.en;
  reports: CivicReport[];
  loadingReports: boolean;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  openReportDetails: (id: string) => void;
  fetchReports: () => Promise<void>;
  createReport: (reportData: Partial<CivicReport>) => Promise<CivicReport | null>;
  updateReportStatus: (id: string, status: CivicReport['status']) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  draftIssue: DraftIssue;
  setDraftIssue: React.Dispatch<React.SetStateAction<DraftIssue>>;
  clearDraftIssue: () => void;
  startNewIssueWithCategory: (category: CivicCategory) => void;
  startNewIssueWithDetails: (details: Partial<DraftIssue>) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  removeToast: (id: string) => void;
  activeAiStatus: { configured: boolean; mode: string };
  searchFocusTrigger: number;
  triggerSearchFocus: () => void;
}

const defaultDraft: DraftIssue = {
  category: 'road_damage',
  title: '',
  description: '',
  address: 'Anna Nagar 2nd Avenue, Chennai',
  ward: 'Ward 102 - Zone 8',
  latitude: 13.0850,
  longitude: 80.2101
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('sahaaya_language') as AppLanguage) || 'en';
  });
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loadingReports, setLoadingReports] = useState<boolean>(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [draftIssue, setDraftIssue] = useState<DraftIssue>(defaultDraft);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeAiStatus, setActiveAiStatus] = useState({ configured: false, mode: 'INITIALIZING' });
  const [searchFocusTrigger, setSearchFocusTrigger] = useState<number>(0);

  const triggerSearchFocus = () => {
    setCurrentView('myReports');
    setSearchFocusTrigger(prev => prev + 1);
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('sahaaya_language', lang);
  };

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setActiveAiStatus({
          configured: data.aiEngine?.configured || false,
          mode: data.aiEngine?.mode || 'FALLBACK'
        });
      }
    } catch {
      setActiveAiStatus({ configured: false, mode: 'OFFLINE_READY' });
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.warn('Failed to load reports from server, maintaining cache:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchReports();
  }, []);

  const createReport = async (reportData: Partial<CivicReport>): Promise<CivicReport | null> => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        const created: CivicReport = await res.json();
        setReports(prev => [created, ...prev]);
        addToast('success', `Grievance ticket created: ${created.id}`);
        return created;
      } else {
        const err = await res.json();
        addToast('error', err.error || 'Failed to submit report');
      }
    } catch {
      addToast('error', 'Network error while lodging report.');
    }
    return null;
  };

  const updateReportStatus = async (id: string, status: CivicReport['status']) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => (r.id === id ? updated : r)));
        addToast('info', `Status updated to: ${status.replace('_', ' ').toUpperCase()}`);
      }
    } catch {
      addToast('error', 'Failed to update report status.');
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
        addToast('info', `Report ${id} removed.`);
        if (selectedReportId === id) {
          setSelectedReportId(null);
          setCurrentView('my-reports');
        }
      }
    } catch {
      addToast('error', 'Failed to delete report.');
    }
  };

  const openReportDetails = (id: string) => {
    setSelectedReportId(id);
    setCurrentView('report-details');
  };

  const startNewIssueWithCategory = (category: CivicCategory) => {
    setDraftIssue(prev => ({
      ...prev,
      category
    }));
    setCurrentView('new-issue');
  };

  const startNewIssueWithDetails = (details: Partial<DraftIssue>) => {
    setDraftIssue(prev => ({
      ...prev,
      ...details
    }));
    setCurrentView('new-issue');
  };

  const clearDraftIssue = () => {
    setDraftIssue(defaultDraft);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        reports,
        loadingReports,
        selectedReportId,
        setSelectedReportId,
        openReportDetails,
        fetchReports,
        createReport,
        updateReportStatus,
        deleteReport,
        draftIssue,
        setDraftIssue,
        clearDraftIssue,
        startNewIssueWithCategory,
        startNewIssueWithDetails,
        toasts,
        addToast,
        removeToast,
        activeAiStatus,
        searchFocusTrigger,
        triggerSearchFocus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
