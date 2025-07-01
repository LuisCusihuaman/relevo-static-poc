import React, { useState, useEffect } from 'react';
import { 
  HandoverHistory, 
  FullscreenEditor, 
  MobileMenus, 
  CollaborationPanel 
} from '.';
import { Header } from './layout/Header';
import { MainContent } from './layout/MainContent';
import { Footer } from './layout/Footer';
import { Button } from '@/components/ui/button';
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
import { X } from 'lucide-react';

interface HandoverProps {
  onBack?: () => void;
}

export default function App({ onBack }: HandoverProps = {}) {
  // Core state
  const [handoverComplete, setHandoverComplete] = useState(false);
  
  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
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
            onBack={onBack}
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