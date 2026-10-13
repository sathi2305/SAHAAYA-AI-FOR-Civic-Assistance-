/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { NewIssueView } from './components/views/NewIssueView';
import { MyReportsView } from './components/views/MyReportsView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { MapView } from './components/views/MapView';
import { ReportDetailsView } from './components/views/ReportDetailsView';
import { SettingsView } from './components/views/SettingsView';
import { CommunityImpactView } from './components/views/CommunityImpactView';
import { ToastContainer } from './components/common/ToastContainer';
import { ProjectChatbotWidget } from './components/common/ProjectChatbotWidget';

const MainRouter: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'newIssue':
      case 'new-issue':
        return <NewIssueView />;
      case 'myReports':
      case 'my-reports':
        return <MyReportsView />;
      case 'aiAssistant':
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'mapView':
      case 'map-view':
        return <MapView />;
      case 'reportDetails':
      case 'report-details':
        return <ReportDetailsView />;
      case 'communityImpact':
      case 'community-impact':
        return <CommunityImpactView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell>
      {renderCurrentView()}
      <ProjectChatbotWidget />
      <ToastContainer />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
