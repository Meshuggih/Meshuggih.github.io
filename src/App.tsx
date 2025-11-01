import React from 'react';
import { ApiKeyModal } from '@components/ApiKeyModal';
import { SpaceDashboard } from '@components/SpaceDashboard';

/**
 * Main App Component
 * Orchestrates the entire DawlessStudio application
 */
export const App: React.FC = () => {
  return (
    <>
      {/* API Key Configuration Modal - appears on first load */}
      <ApiKeyModal />

      {/* Main Space Dashboard Interface */}
      <SpaceDashboard />
    </>
  );
};
