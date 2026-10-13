export type CivicCategory = 
  | 'road_damage'
  | 'water_leakage'
  | 'sanitation'
  | 'streetlights'
  | 'drainage'
  | 'other';

export type ReportStatus = 
  | 'submitted'
  | 'in_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type AppLanguage = 'en' | 'ta';

export type AppView = 
  | 'landing'
  | 'dashboard'
  | 'newIssue'
  | 'myReports'
  | 'aiAssistant'
  | 'mapView'
  | 'reportDetails'
  | 'settings'
  | 'communityImpact'
  | 'new-issue'
  | 'my-reports'
  | 'ai-assistant'
  | 'map-view'
  | 'report-details'
  | 'community-impact';

export interface TimelineEvent {
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: CivicCategory;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  evidenceUrl?: string;
  evidenceName?: string;
  aiSummary?: string;
  complaintDraft?: string;
  missingDetails?: string[];
  recommendations?: string[];
  department?: string;
  urgency?: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  timeline: TimelineEvent[];
}

export interface AiAnalysisResult {
  category: CivicCategory;
  urgency: UrgencyLevel;
  summary: string;
  missing_details: string[];
  recommendations: string[];
  department: string;
  complaint_draft: string;
  confidence: number;
  disclaimer: string;
  isAiLive?: boolean;
  provider?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  draftData?: {
    category: CivicCategory;
    title: string;
    description: string;
    location?: string;
  };
  suggestions?: string[];
}
