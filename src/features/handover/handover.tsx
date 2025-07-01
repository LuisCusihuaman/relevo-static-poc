import React, { useState, useEffect } from 'react';
import { 
  DailyWorkflow, 
  HandoverHistory, 
  FullscreenEditor, 
  MobileMenus, 
  CollaborationPanel 
} from '.';
import { Header } from './layout/Header';
import { MainContent } from './layout/MainContent';
import { Footer } from './layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHandoverSession } from '.';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { currentUser, patientData, activeCollaborators } from '@/common/constants';
import type { FullscreenEditingState, ExpandedSections } from '@/common/types';
import { Clock, Stethoscope, X } from 'lucide-react';

export default function App() {
  // Core state
  const [workflowSetup, setWorkflowSetup] = useState(false);
  const [handoverComplete, setHandoverComplete] = useState(false);
  
  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fullscreen editing state
  const [fullscreenEditing, setFullscreenEditing] = useState<FullscreenEditingState | null>(null);
  const [currentSaveFunction, setCurrentSaveFunction] = useState<(() => void) | null>(null);

  // Layout and content state
  const [layoutMode, setLayoutMode] = useState<'single' | 'columns'>('columns');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    illness: true,      // Start with first section open
    patient: false,
    actions: false,
    awareness: false,
    synthesis: false
  });

  // Custom hooks
  const isMobile = useIsMobile();
  const { getTimeUntilHandover, getSessionDuration } = useHandoverSession();
  const { syncStatus, setSyncStatus, getSyncStatusDisplay } = useSyncStatus();

  // Event handlers
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({ 
      ...prev, 
      [sectionKey]: !prev[sectionKey as keyof ExpandedSections] 
    }));
  };

  const handleNavigateToSection = (section: string) => {
    if (layoutMode === 'single') {
      setExpandedSections(prev => ({ ...prev, [section]: true }));
    }
    console.log(`Navigating to I-PASS section: ${section}`);
  };

  const handleOpenDiscussion = () => {
    setShowComments(true);
  };

  const handleOpenFullscreenEdit = (component: 'patient-summary' | 'situation-awareness', autoEdit: boolean = true) => {
    setFullscreenEditing({ component, autoEdit });
  };

  const handleCloseFullscreenEdit = () => {
    setFullscreenEditing(null);
  };

  const handleFullscreenSave = () => {
    if (currentSaveFunction) {
      currentSaveFunction();
    }
  };

  const handleSaveReady = (saveFunction: () => void) => {
    setCurrentSaveFunction(() => saveFunction);
  };

  // Handle escape key to exit focus mode or fullscreen editing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (fullscreenEditing) {
          setFullscreenEditing(null);
        } else if (focusMode) {
          setFocusMode(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, fullscreenEditing]);

  // Show workflow setup if not completed
  if (!workflowSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simplified Header for Setup */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-6 h-6 text-gray-900" />
                <h1 className="text-xl font-bold text-gray-900">RELEVO</h1>
              </div>
              <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 hidden sm:flex">
                I-PASS Setup
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Daily Workflow Setup */}
        <div className="px-4 sm:px-6 py-8">
          <DailyWorkflow 
            currentUser={currentUser} 
            onSetupComplete={() => setWorkflowSetup(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Fullscreen Editor */}
        {fullscreenEditing && (
          <FullscreenEditor
            fullscreenEditing={fullscreenEditing}
            handleCloseFullscreenEdit={handleCloseFullscreenEdit}
            handleFullscreenSave={handleFullscreenSave}
            handleSaveReady={handleSaveReady}
            handleOpenDiscussion={handleOpenDiscussion}
            syncStatus={syncStatus}
            setSyncStatus={setSyncStatus}
          />
        )}

        {/* Desktop History Sidebar - Left side */}
        {showHistory && !focusMode && !isMobile && !fullscreenEditing && (
          <Sidebar side="left" collapsible="offcanvas">
            <SidebarHeader className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Handover History</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <HandoverHistory onClose={() => setShowHistory(false)} patientData={patientData} hideHeader={true} />
            </SidebarContent>
          </Sidebar>
        )}

        {/* Main Content Area */}
        <SidebarInset className="min-h-screen bg-gray-50">
          {/* Header */}
          <Header
            focusMode={focusMode}
            showCollaborators={showCollaborators}
            setShowCollaborators={setShowCollaborators}
            setFocusMode={setFocusMode}
            setShowComments={setShowComments}
            setShowHistory={setShowHistory}
            setShowMobileMenu={setShowMobileMenu}
            showComments={showComments}
            showHistory={showHistory}
            getSyncStatusDisplay={getSyncStatusDisplay}
            getTimeUntilHandover={getTimeUntilHandover}
            getSessionDuration={getSessionDuration}
            currentUser={currentUser}
          />

          {/* Main Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <MainContent
              focusMode={focusMode}
              layoutMode={layoutMode}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleOpenDiscussion={handleOpenDiscussion}
              handleOpenFullscreenEdit={handleOpenFullscreenEdit}
              syncStatus={syncStatus}
              setSyncStatus={setSyncStatus}
              setHandoverComplete={setHandoverComplete}
              getSessionDuration={getSessionDuration}
              currentUser={currentUser}
            />
          </div>

          {/* Footer */}
          <Footer
            focusMode={focusMode}
            fullscreenEditing={!!fullscreenEditing}
            handoverComplete={handoverComplete}
            getTimeUntilHandover={getTimeUntilHandover}
            getSessionDuration={getSessionDuration}
          />
        </SidebarInset>

        {/* Desktop Collaboration Sidebar - Right side */}
        {showComments && !focusMode && !isMobile && !fullscreenEditing && (
          <Sidebar side="right" collapsible="offcanvas">
            <SidebarHeader className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Handover Collaboration</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <CollaborationPanel 
                onClose={() => setShowComments(false)} 
                onNavigateToSection={handleNavigateToSection}
                hideHeader={true}
              />
            </SidebarContent>
          </Sidebar>
        )}

        {/* Mobile Menus */}
        {isMobile && (
          <MobileMenus
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            showComments={showComments}
            setShowComments={setShowComments}
            setFocusMode={setFocusMode}
            focusMode={focusMode}
            fullscreenEditing={!!fullscreenEditing}
            getTimeUntilHandover={getTimeUntilHandover}
            getSessionDuration={getSessionDuration}
            handleNavigateToSection={handleNavigateToSection}
            currentUser={currentUser}
          />
        )}
      </SidebarProvider>
    </TooltipProvider>
  );
}